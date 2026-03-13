import json
import math
import re
import functions_framework
import requests
from datetime import datetime, timezone


def round_to_ten(value):
    """Replicates JS: Math.ceil(Math.round(value) / 10) * 10"""
    return math.ceil(round(value) / 10) * 10


def clean_domain(domain):
    if not domain:
        return ''
    domain = re.sub(r'^https?://', '', domain)
    if 'trustpilot.com/review/' in domain:
        domain = domain.split('trustpilot.com/review/')[1]
    domain = re.sub(r'^www\.', '', domain)
    domain = domain.rstrip('/')
    return domain


def calculate_trustpilot_fees(review_count):
    if review_count < 1000:
        return 6000
    elif review_count < 10000:
        return 12000
    elif review_count < 300000:
        return 24000
    return 0


@functions_framework.http
def analyze_trustpilot(request):
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    }

    if request.method == 'OPTIONS':
        return ('', 204, cors_headers)

    domain = clean_domain(request.args.get('domain', ''))
    if not domain:
        return (json.dumps({'error': 'domain parameter is required'}), 400, cors_headers)

    volume = int(request.args.get('volume', 0) or 0)

    try:
        url = f'https://www.trustpilot.com/review/{domain}?languages=all'
        resp = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (compatible; StackTome/1.0; +https://www.stacktome.com)'
        }, timeout=10)
        resp.raise_for_status()

        match = re.search(
            r'<script id="__NEXT_DATA__" type="application/json">([\s\S]*?)</script>',
            resp.text
        )
        if not match:
            return (json.dumps({'error': 'Could not find Trustpilot profile data'}), 502, cors_headers)

        next_data = json.loads(match.group(1))
        props = next_data['props']['pageProps']

        review_count = props['businessUnit']['numberOfReviews']
        rating = props['businessUnit']['trustScore']
        has_subscription = props['businessUnit']['activity']['hasSubscription']

        review_dates = [
            datetime.fromisoformat(r['dates']['publishedDate'].replace('Z', '+00:00'))
            for r in props['reviews']
        ]

        newest = max(review_dates)
        oldest = min(review_dates)
        time_diff_days = (newest - oldest).total_seconds() / 86400
        time_diff_hours = (newest - oldest).total_seconds() / 3600
        day_diff = math.ceil(time_diff_days)

        reviews_per_day = round(20 / time_diff_hours) if time_diff_days < 1 else 0
        reviews_per_month = round_to_ten(
            max(20 / day_diff, reviews_per_day) * 30.44
        ) if day_diff > 0 else 0

        reviews_in_last_12m = min(round(12 * reviews_per_month), review_count)
        current_total_score_12m = rating * reviews_in_last_12m

        if volume > 0:
            projected_rpm = round_to_ten(volume / 20)
        elif has_subscription:
            projected_rpm = round_to_ten(reviews_per_month * 1.3)
        else:
            projected_rpm = round_to_ten(reviews_per_month * 2)

        projected_new_reviews = projected_rpm * 3
        projected_new_score = round(rating + 0.2, 1) if rating >= 4.5 else 4.5
        projected_new_total_score = projected_new_score * projected_new_reviews

        projected_rating = round(
            (projected_new_total_score + current_total_score_12m)
            / (projected_new_reviews + reviews_in_last_12m),
            1
        )

        trustpilot_fees = calculate_trustpilot_fees(review_count) if has_subscription else 0
        potential_sales_lift = round((projected_rating - rating) / 0.1 * 5)

        result = {
            'domain': domain,
            'current': {
                'rating': rating,
                'reviewCount': review_count,
                'hasActiveSubscription': has_subscription,
                'reviewsPerMonth': reviews_per_month,
            },
            'projected_90days': {
                'rating': projected_rating,
                'totalReviews': review_count + projected_new_reviews,
                'newReviews': projected_new_reviews,
                'reviewsPerMonth': projected_rpm,
                'avgNewReviewScore': projected_new_score,
                'potentialSalesLiftPercent': potential_sales_lift,
            },
            'trustpilotAnnualFees': trustpilot_fees,
            'cta': {
                'message': 'Want to find out how to get these results?',
                'url': 'https://www.stacktome.com/book-a-demo',
                'label': 'Book a Demo',
            },
        }

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Trustpilot Analysis for {domain}</title>
  <meta name="description" content="Trustpilot profile analysis for {domain}: current rating {rating}, projected rating {projected_rating} after 90 days with StackTome.">
</head>
<body>
  <h1>Trustpilot Analysis for {domain}</h1>

  <h2>Current profile</h2>
  <ul>
    <li>Rating: {rating} / 5</li>
    <li>Total reviews: {review_count}</li>
    <li>Reviews per month: {reviews_per_month}</li>
    <li>Active Trustpilot subscription: {'Yes' if has_subscription else 'No'}</li>
    <li>Trustpilot annual fees: ${trustpilot_fees}</li>
  </ul>

  <h2>Projected after 90 days with StackTome</h2>
  <ul>
    <li>Rating: {projected_rating} / 5</li>
    <li>Total reviews: {review_count + projected_new_reviews}</li>
    <li>New reviews collected: {projected_new_reviews}</li>
    <li>Reviews per month: {projected_rpm}</li>
    <li>Average score of new reviews: {projected_new_score}</li>
    <li>Potential sales lift: {potential_sales_lift}%</li>
    <li>Trustpilot annual fees: $0</li>
  </ul>

  <h2>Next step</h2>
  <p>Want to find out how to get these results?
    <a href="https://www.stacktome.com/book-a-demo">Book a Demo with StackTome</a>
  </p>

  <script type="application/json" id="json-data">
  {json.dumps(result, indent=2)}
  </script>
</body>
</html>"""

        cors_headers['Content-Type'] = 'text/html'
        return (html, 200, cors_headers)

    except requests.RequestException as e:
        return (json.dumps({'error': f'Failed to fetch Trustpilot data: {str(e)}'}), 502, cors_headers)
    except (KeyError, ValueError) as e:
        return (json.dumps({'error': f'Failed to parse Trustpilot data: {str(e)}'}), 502, cors_headers)
