#!/usr/bin/env node
// Simulates SelectSpecs' own website consuming the render-service fragment — the actual
// integration model from render-service-implementation.md's appendix: server fetches
// POST /v1/templates/{templateId}/page with the org's auth header (never in the browser), then
// injects the returned HTML into its own page, which owns <title>/meta/canonical (spec §11.4).
//
// Mirrors support/specs/selectspecs-review-page/simulate-customer-site.js — kept here too so
// this repo (stacktome.github.io) has its own runnable copy alongside the static snapshots in
// this same docs/customers/selectspecs/ folder (testable-review-page.html,
// render-fragment-test.html). `build` mode below produces exactly that kind of static file.
//
// Compatible with the render-service v4 endpoint (POST /v1/templates/{templateId}/page,
// live on feature/per-request-timeouts as of 2026-07-16).
//
// Usage — against production (the default; there's no local counterpart to this repo's
// static output, so this is meant to snapshot the real deployed page):
//   APIKEY=<org backend apikey> TEMPLATE_ID=720 node simulate-customer-site.js build <outfile>
//   APIKEY=<org backend apikey> TEMPLATE_ID=720 node simulate-customer-site.js serve [port]
// Against a local review-service instead (via the local gateway on port 9000):
//   RENDER_API_BASE=http://localhost:9000/api/reviews APIKEY=<local backend key> TEMPLATE_ID=2 node simulate-customer-site.js build <outfile>
// No client-side key is needed here — the public, domain-restricted apikey used for the
// browser-side fetch/filter calls is already embedded in the fragment's own JS by the
// render service (stamped from the template's own config), not supplied by this script.
// APIKEY is never hardcoded here (it's a real credential) — always pass it via env var, never commit it.

const http = require('http');

const RENDER_API_BASE = process.env.RENDER_API_BASE || 'https://services.stacktome.com/api/reviews';
const AUTH_HEADER_NAME = process.env.AUTH_HEADER_NAME || 'apikey';
const AUTH_HEADER_VALUE = process.env.APIKEY || process.env.AUTH_HEADER_VALUE;
const ROOT_ID = process.env.ROOT_ID || 'selectspecs-reviews';
const TEMPLATE_ID = process.env.TEMPLATE_ID || '720';

async function fetchFragment() {
  if (!AUTH_HEADER_VALUE) throw new Error('APIKEY env var is required (the backend apikey for this account)');
  const url = `${RENDER_API_BASE}/v1/templates/${TEMPLATE_ID}/page`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { [AUTH_HEADER_NAME]: AUTH_HEADER_VALUE, 'Content-Type': 'application/json' },
    body: JSON.stringify({ rootId: ROOT_ID }),
  });
  if (!res.ok) throw new Error(`render service returned ${res.status}`);
  return res.text();
}

// The customer's own page chrome — title/meta/canonical/nav/footer are theirs, not ours
// (render-service-implementation.md §11.4: we supply the fragment's JSON-LD, they supply this).
function wrapInHostPage(fragmentHtml) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SelectSpecs.com Reviews — ★4.5 from 80,000+ verified customers</title>
<meta name="description" content="Real, order-verified customer reviews of SelectSpecs.com — ratings, delivery experience, and answers to common questions.">
<link rel="canonical" href="https://www.selectspecs.com/reviews">
<style>
  /* Host site chrome only — deliberately distinct from the fragment's own scoped CSS, so
     any visual bleed either direction is immediately obvious. */
  body{margin:0;font-family:Arial,sans-serif;background:#fff}
  .host-nav{background:#0b3d91;color:#fff;padding:14px 24px;font-size:15px}
  .host-nav a{color:#fff;text-decoration:none;margin-right:18px}
  .host-footer{background:#0b3d91;color:#cfe0ff;padding:18px 24px;font-size:13px;margin-top:40px}
</style>
</head>
<body>
<nav class="host-nav"><a href="/">Home</a><a href="/glasses">Glasses</a><a href="/sunglasses">Sunglasses</a><a href="/reviews">Reviews</a></nav>
<main>
${fragmentHtml}
</main>
<div class="host-footer">© SelectSpecs.com — host page chrome, not part of the render-service fragment</div>
</body>
</html>
`;
}

function errorPage(message) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Reviews unavailable</title></head>
<body style="font-family:sans-serif;padding:40px;color:#900">
<h1>Reviews are temporarily unavailable</h1>
<p>${message}</p>
</body></html>`;
}

async function serve(port) {
  const server = http.createServer(async (req, res) => {
    try {
      const fragment = await fetchFragment();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(wrapInHostPage(fragment));
    } catch (err) {
      console.error('render fetch failed:', err.message);
      res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(errorPage(err.message));
    }
  });
  server.listen(port, () => {
    console.log(`Simulated customer site: http://localhost:${port}`);
    console.log(`Fetching fragments from: ${RENDER_API_BASE} (header ${AUTH_HEADER_NAME})`);
  });
}

async function build(outfile) {
  const fragment = await fetchFragment();
  const fs = require('fs');
  fs.writeFileSync(outfile, wrapInHostPage(fragment));
  console.log(`Wrote ${outfile}`);
}

const [, , cmd, arg] = process.argv;
if (cmd === 'serve') {
  serve(parseInt(arg, 10) || 8123);
} else if (cmd === 'build') {
  if (!arg) { console.error('usage: node simulate-customer-site.js build <outfile>'); process.exit(1); }
  build(arg).catch(err => { console.error(err); process.exit(1); });
} else {
  console.error('usage: node simulate-customer-site.js serve [port] | build <outfile>');
  process.exit(1);
}
