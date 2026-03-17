
# Stacktome Merchandising Intelligence Demo Dashboard

## Overview

A unified analytics interface that combines review sentiment with transaction behaviour to surface product health, LTV drivers, and churn risk — enabling non-analysts (buyers, category managers, eCommerce directors) to answer questions no BigQuery setup can answer in real time.

## Core Differentiator

Stacktome uniquely fuses review text with transaction data via a graph structure, enabling multi-hop queries that would require expensive engineering in flat SQL. The demo proves this moat with four always-on modules and a conversational agent layer.

---

## Dashboard Modules

### 1. **Product Health Matrix** (The At-a-Glance)
Four-quadrant bubble chart: review score trajectory (X) × repeat purchase rate (Y), bubble size = revenue, colour = return rate. Single view identifies quality risks before they hit returns P&L.

### 2. **Review-LTV Attribution** (The ROI Anchor)
Scatter plot: average review score (X) × 180-day customer LTV (Y). Quantifies the direct revenue impact of product quality — e.g., *"1-star improvement correlates with +£340 LTV."*

### 3. **Voice of Customer Tracker** (The Risk Early Warning)
Rising complaint topics by category, ranked by frequency and trend. Flags topics up >20% WoW with example quotes. Surfaces unmet demand from review text.

### 4. **Churn Risk Register** (The Action List)
Customers with 2+ orders + negative review + purchase gap. Ranked by LTV at risk. Exportable to Klaviyo.

---

## Agent Q&A Layer

Bounded tool library (20–30 pre-built graph traversals) routed by intent. Pre-canned prompts remove blank-canvas paralysis:

- *"Show me high-revenue SKUs with declining review scores"*
- *"What products do customers compare us to in reviews?"*
- *"Which new launches are tracking below cohort benchmark?"*

Agent returns synthesis with recommended action, not raw queries.