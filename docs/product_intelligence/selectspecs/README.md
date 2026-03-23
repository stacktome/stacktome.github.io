# Selectspecs — Product Intelligence

Merchandising intelligence reports for Selectspecs, an online optician.

**Data source:** Service (order) reviews 2024–2025 via `product_graph_selectspecs`.
Product-level reviews are not available for this account — all analysis uses service reviews
attributed to products via the `Review → FOR_ORDER → Order → CONTAINS → Product` path.

## Reports

| Report | Description |
|--------|-------------|
| [VoC + Churn Risk](voc_churn_risk.html) | Category complaint breakdown (quality, delivery, returns, service, packaging) · 712 churn-risk customers · £136k LTV at stake |
| [Review LTV Attribution](review_ltv_attribution.html) | Post-review LTV by score band, 2024 vs 2025 · 5★ reviews → £82 avg LTV, up 13% YoY |
| [Product Quality Risk](product_health_matrix.html) | Products ranked by quality complaint rate via service review signal · 15 SKUs tracked |

## Key findings

- **Returns is the top pain point** — 70% of returns-category mentions are negative
- **Delivery complaints** are the largest in volume (1,476 negative) despite strong positive signal (2,448)
- **5★ reviewers** generate £82 post-review LTV in 2025 vs £73 in 2024 (+13%)
- **3020 - blue** has the highest absolute quality complaint volume (29 neg, 31% neg rate, rising)
- **2396 - black tortoise** shows the fastest-rising complaints (2 neg in 2024 → 12 in 2025)
- **712 customers** rated the service ≤2★ since Jan 2024, representing £136k LTV at risk

## Methodology notes

- **Post-review LTV**: orders placed after review date within the same calendar year (avoids mixing 2024 pre-review spend into 2025 comparison)
- **Quality attribution**: `HAS_CATEGORY` edges with `sentiment='negative'` and `category='quality'`, resolved to products via `FOR_ORDER → CONTAINS`
- **Churn risk**: customers with any ≤2★ service review since Jan 2024, ordered by all-time monetary LTV
