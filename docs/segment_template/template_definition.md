# Template Definition

A template definition within the segment builder serves as an SQL criteria, akin to a 'where condition', allowing users to filter data based on specified parameters. These templates facilitate the creation of customizable segments by incorporating placeholder values that can be configured via the segment builder's user interface (UI). The primary aim is to establish concise templates that can be flexibly combined and reused across various segments.

To create a new template, follow these steps:

1. Define Field: Specify the field from the customer event table to filter on. This step is required.
Example: "count_purchase"

2. Add Placeholder Condition (Optional): Optionally, include a placeholder condition such as {condition:number/text/date}.

3. Add Placeholder for Value (Optional): Optionally, incorporate a placeholder for the value.

Note: Each template allows for a maximum of two placeholders to ensure ease of combination and simplification in the segments UI.

Every template should include a descriptive text that provides additional information to users. This description can be viewed on the segment edit page whenever more details are required.

# Examples

1. product_sku_base {condition:text[]}

This template is designed to filter data based on a product's stock keeping unit (SKU).

* Define Field: In this template, the field is predefined as product_sku_base. This means you’re filtering data based on the product SKU, which is a unique identifier for each product.
* Placeholder Condition: The {condition:text[]} placeholder condition indicates that the input should be text-based, allowing users to input one or multiple product SKUs separated by commas, brackets, or any other specified delimiter.

2. date(ts_dispatch_scheduled) {condition:date_range}

This template enables users to filter data based on the scheduled dispatch date.

* Define Field: This template is predefined to filter data based on the ts_dispatch_scheduled field, which represents the scheduled dispatch date of an event or transaction.
* Placeholder Condition: The {condition:date_range} placeholder condition indicates that users can specify a date range as the filter criteria. This allows for flexible filtering based on specific time intervals.

# Condition Types

Templates support various types of conditions such as number, date, text, and value.

# Number Conditions

* is equal to: = {value}
* is not equal to: != {value}
* is more than: > {value}
* is less than: < {value}
* is greater than or equal to: >= {value}
* is less than or equal to: <= {value}
* is one of: IN ({values…})

Example: (count_purchase  = 1)

# Date Conditions

* within: > {value: datetime_interval}
* before: < {value: date}
* on or before: <= {value: date}
* after: > {value: date}
* on or after: >= {value: date}
* between: between {from: date} AND {to: date}
* on the date: = {value: date}

Example: (date(ts_dispatch_scheduled) BETWEEN '2024-06-01' AND '2024-06-07')

# Text Conditions

* Is equal to: = {value}
* Is not equal to: != {value}
* Starts with: > like ‘{value}%’
* Contains: like ‘%{value}%’
* Is one of: IN (‘{values…}’)

Example: (product_sku_base = SK002)

# Value Conditions

* Number: {value: number}
* Date: {value: date}
* Date range: {from: date}, {to: date}
* Datetime interval: {value, type} - for example {2, hours} → (current_timestamp - interval 2 hours)
* Text: '{value: string}'
* Array of numbers: [{value1:number},{value2:number},{value3:number}]
* Array of text: [{value1:string},{value2:string},{value3:string}]

# Schemas

<details> <summary>Customer Profile Schema</summary> <table> <tr> <td>first_name</td> <td>STRING</td> <td>First name of the customer.</td> </tr> <tr> <td>last_name</td> <td>STRING</td> <td>Last name of the customer.</td> </tr> <tr> <td>full_name</td> <td>STRING</td> <td>Full name of the customer.</td> </tr> <tr> <td>email</td> <td>STRING</td> <td>Email address of the customer.</td> </tr> <tr> <td>email_hash</td> <td>STRING</td> <td>Hashed version of the customer's email address.</td> </tr> <tr> <td>email_organization</td> <td>STRING</td> <td>Organization or domain part of the customer's email address.</td> </tr> <tr> <td>email_tld</td> <td>STRING</td> <td>Top-level domain of the customer's email address.</td> </tr> <tr> <td>mobile</td> <td>STRING</td> <td>Mobile number of the customer.</td> </tr> <tr> <td>gender_derived</td> <td>STRING</td> <td>Derived gender information of the customer.</td> </tr> <tr> <td>first_order_id</td> <td>STRING</td> <td>Identifier of the customer's first order.</td> </tr> <tr> <td>last_order_id</td> <td>STRING</td> <td>Identifier of the customer's last order.</td> </tr> <tr> <td>app_id</td> <td>STRING</td> <td>Identifier for the application.</td> </tr> <tr> <td>count_purchase</td> <td>INTEGER</td> <td>Total number of purchases made by the customer.</td> </tr> <tr> <td>monetary</td> <td>FLOAT</td> <td>Total monetary value spent by the customer.</td> </tr> <tr> <td>average_monetary</td> <td>FLOAT</td> <td>Average monetary value spent per purchase by the customer.</td> </tr> <tr> <td>monetary_discount</td> <td>FLOAT</td> <td>Total monetary value of discounts applied to purchases made by the customer.</td> </tr> <tr> <td>average_monetary_discount</td> <td>FLOAT</td> <td>Average monetary value of discounts applied per purchase by the customer.</td> </tr> <tr> <td>total_order_rating</td> <td>INTEGER</td> <td>Total rating given by the customer for all orders.</td> </tr> <tr> <td>total_product_rating</td> <td>INTEGER</td> <td>Total rating given by the customer for all products.</td> </tr> <tr> <td>total_product_price_viewed</td> <td>FLOAT</td> <td>Total price of products viewed by the customer.</td> </tr> <tr> <td>count_product_price_viewed</td> <td>INTEGER</td> <td>Total number of times products' prices were viewed by the customer.</td> </tr> <tr> <td>average_order_rating</td> <td>FLOAT</td> <td>Average rating given by the customer for orders.</td> </tr> <tr> <td>average_product_rating</td> <td>FLOAT</td> <td>Average rating given by the customer for products.</td> </tr> <tr> <td>average_product_price_viewed</td> <td>FLOAT</td> <td>Average price of products viewed by the customer.</td> </tr> <tr> <td>count_landing</td> <td>INTEGER</td> <td>Total number of landing page visitsby the customer.</td> </tr> <tr> <td>count_page_view</td> <td>INTEGER</td> <td>Total number of page views by the customer.</td> </tr> <tr> <td>count_product_view</td> <td>INTEGER</td> <td>Total number of product views by the customer.</td> </tr> <tr> <td>count_checkout_view</td> <td>INTEGER</td> <td>Total number of checkout views by the customer.</td> </tr> <tr> <td>count_email_open</td> <td>INTEGER</td> <td>Total number of email opens by the customer.</td> </tr> <tr> <td>count_email_click</td> <td>INTEGER</td> <td>Total number of email clicks by the customer.</td> </tr> <tr> <td>count_campaign_click</td> <td>INTEGER</td> <td>Total number of campaign clicks by the customer.</td> </tr> <tr> <td>count_order_review</td> <td>INTEGER</td> <td>Total number of order reviews by the customer.</td> </tr> <tr> <td>count_product_review</td> <td>INTEGER</td> <td>Total number of product reviews by the customer.</td> </tr> <tr> <td>count_unq_landing_page</td> <td>INTEGER</td> <td>Total number of unique landing pages visited by the customer.</td> </tr> <tr> <td>count_unq_page_view</td> <td>INTEGER</td> <td>Total number of unique pages viewed by the customer.</td> </tr> <tr> <td>count_unq_product_view</td> <td>INTEGER</td> <td>Total number of unique products viewed by the customer.</td> </tr> <tr> <td>count_unq_checkout</td> <td>INTEGER</td> <td>Total number of unique checkout views by the customer.</td> </tr> <tr> <td>count_unq_campaign_medium</td> <td>INTEGER</td> <td>Total number of unique campaign mediums clicked by the customer.</td> </tr> <tr> <td>ts_first_purchase</td> <td>TIMESTAMP</td> <td>Timestamp of the customer's first purchase.</td> </tr> <tr> <td>ts_last_purchase</td> <td>TIMESTAMP</td> <td>Timestamp of the customer's last purchase.</td> </tr> <tr> <td>ts_first_clickstream</td> <td>TIMESTAMP</td> <td>Timestamp of the first clickstream event by the customer.</td> </tr> <tr> <td>ts_last_clickstream</td> <td>TIMESTAMP</td> <td>Timestamp of the last clickstream event by the customer.</td> </tr> <tr> <td>ts_first_page_view</td> <td>TIMESTAMP</td> <td>Timestamp of the first page view by the customer.</td> </tr> <tr> <td>ts_last_page_view</td> <td>TIMESTAMP</td> <td>Timestamp of the last page view by the customer.</td> </tr> <tr> <td>ts_first_product_view</td> <td>TIMESTAMP</td> <td>Timestamp of the first product view by the customer.</td> </tr> <tr> <td>ts_last_product_view</td> <td>TIMESTAMP</td> <td>Timestamp of the last product view by the customer.</td> </tr> <tr> <td>ts_first_checkout</td> <td>TIMESTAMP</td> <td>Timestamp of the first checkout by the customer.</td> </tr> <tr> <td>ts_last_checkout</td> <td>TIMESTAMP</td> <td>Timestamp of the last checkout by the customer.</td> </tr> <tr> <td>ts_first_email_open</td> <td>TIMESTAMP</td> <td>Timestamp of the first email open by the customer.</td> </tr> <tr> <td>ts_last_email_open</td> <td>TIMESTAMP</td> <td>Timestamp of the last email open by the customer.</td> </tr> <tr> <td>ts_first_email_click</td> <td>TIMESTAMP</td> <td>Timestamp of the first email click by the customer.</td> </tr> <tr> <td>ts_last_email_click</td> <td>TIMESTAMP</td> <td>Timestamp of the last email click by the customer.</td> </tr> <tr> <td>ts_last_review</td> <td>TIMESTAMP</td> <td>Timestamp of the last review given by the customer.</td> </tr> <tr> <td>ts_last_preference_change</td> <td>TIMESTAMP</td> <td>Timestamp of the last preference change by the customer.</td> </tr> <tr> <td>is_preference_opt_in</td> <td>BOOLEAN</td> <td>Indicates whether the customer has opted into preferences.</td> </tr> <tr> <td>count_stacktome_email_sent</td> <td>INTEGER</td> <td>Total number of emails sent by Stacktome to the customer.</td> </tr> <tr> <td>ts_last_stacktome_email_sent</td> <td>TIMESTAMP</td> <td>Timestamp of the last email sent by Stacktome to the customer.</td> </tr> <tr> <td>count_stacktome_email_sent_last_ts</td> <td>TIMESTAMP</td> <td>Total number of emails sent by Stacktome to the customer until the last timestamp.</td> </tr> <tr> <td>last_stacktome_email_type</td> <td>STRING</td> <td>Type of the last email sent by Stacktome to the customer.</td> </tr> <tr> <td>ts_last_campaign_click</td> <td>TIMESTAMP</td> <td>Timestamp of the last campaign click by the customer.</td> </tr> <tr> <td>last_campaign_source</td> <td>STRING</td> <td>Source of the last campaign clicked by the customer.</td> </tr> <tr> <td>last_campaign_click_id</td> <td>STRING</td> <td>Identifier of the last campaign clicked by the customer.</td> </tr> </table> </details>

<details>
<summary>Customer Event Schema</summary>
<table>
<tr>
      <td>app_id</td>
      <td>STRING</td>
      <td>Generally, this should match the domain name without the TLD, e.g., serenataflowers, hipper.</td>
    </tr>
    <tr>
      <td>customer_key</td>
      <td>STRING</td>
      <td>This is set by UDF: generate key(email, mobile, customer_id).</td>
    </tr>
    <tr>
      <td>email</td>
      <td>STRING</td>
      <td>Email address of the customer.</td>
    </tr>
    <tr>
      <td>email_hash</td>
      <td>STRING</td>
      <td>To get hash as a text string from email address: to_hex(sha256(email_address)).</td>
    </tr>
    <tr>
      <td>email_valid_format</td>
      <td>BOOLEAN</td>
      <td>Flag for valid email format.</td>
    </tr>
    <tr>
      <td>email_organization</td>
      <td>STRING</td>
      <td>Organization or domain part of the customer's email address, e.g., gmail, hotmail, live, outlook.</td>
    </tr>
    <tr>
      <td>email_tld</td>
      <td>STRING</td>
      <td>Top-level domain of the customer's email address, e.g., co.uk, .com, .net.</td>
    </tr>
    <tr>
      <td>mobile</td>
      <td>STRING</td>
      <td>Mobile number of the customer.</td>
    </tr>
    <tr>
      <td>last_name</td>
      <td>STRING</td>
      <td>Last name of the customer.</td>
    </tr>
    <tr>
      <td>gender_derived</td>
      <td>STRING</td>
      <td>Uses lookup table: 'sfhipper.pa.gender` (we should move this elsewhere) based on first_name.</td>
    </tr>
    <tr>
      <td>full_name</td>
      <td>STRING</td>
      <td>Concatenated first and last. May also contain 'title'.</td>
    </tr>
    <tr>
      <td>customer_id</td>
      <td>STRING</td>
      <td>Customer id as per business source.</td>
    </tr>
    <tr>
      <td>ts_event</td>
      <td>TIMESTAMP</td>
      <td>Generally the time the event took place, i.e., not ingestion time.</td>
    </tr>
    <tr>
      <td>ts_inserted</td>
      <td>TIMESTAMP</td>
      <td>The timestamp of the ETL.</td>
    </tr>
    <tr>
      <td>visitor_id</td>
      <td>STRING</td>
      <td>From clickstream visitor_domain_id_src which is the snowplow: visitor_domain_id column.</td>
    </tr>
    <tr>
      <td>visitor_network_id</td>
      <td>STRING</td>
      <td>The network_id is nondomain specific, i.e., 3rd party cookie_id.</td>
    </tr>
    <tr>
      <td>event_type</td>
      <td>STRING</td>
      <td>Clickstream, purchase, review, page, email, ticket.</td>
    </tr>
    <tr>
      <td>event_subtype</td>
      <td>STRING</td>
      <td>View, landing, click (on site action), impression, order_review, product_review.</td>
    </tr>
    <tr>
      <td>event</td>
      <td>STRING</td>
      <td>Generally for clickstream events and email (TBD) only: page_view, page_landing, product_view, product_click, product_landing, checkout_view, add_to_cart, checkout_landing, order_confirmation_view, blog_view, blog_landing, campaign_impression, experiment_impression, email_send, email_impression, email_unsubscribe, email_subscribe, email_bounce, product_impression ie. from clickstream_log.event_action.</td>
    </tr>
    <tr>
      <td>event_source</td>
      <td>STRING</td>
      <td>For clickstream events, this is: relative_url_domain_org (domain, less tld) (e.g., google for external clicks, serenataflowers for internal). For non-clickstream events, we set this to the data source, e.g., feefo, trustpilot.</td>
    </tr>
    <tr>
      <td>event_source_url</td>
      <td>STRING</td>
      <td>This is 'relative_url_path' from clickstream_log, i.e., the referring URL, less the query string. NULL for other events.</td>
    </tr>
    <tr>
      <td>event_source_host</td>
      <td>STRING</td>
      <td>This is 'relative_url_host' from clickstream_log, i.e., the referring host. NULL for other events.</td>
    </tr>
    <tr>
      <td>order_id</td>
      <td>STRING</td>
      <td>Identifier of the order.</td>
    </tr>
    <tr>
      <td>order_number</td>
      <td>STRING</td>
      <td>Order number.</td>
    </tr>
    <tr>
      <td>order_name</td>
      <td>STRING</td>
      <td>Order name.</td>
    </tr>
    <tr>
      <td>orderline_id</td>
      <td>STRING</td>
      <td>Identifier of the orderline.</td>
    </tr>
    <tr>
      <td>order_total_net</td>
      <td>FLOAT</td>
      <td>Order total is always the sum of all order lines Net Revenue, AFTER discount and Tax (currently sales data is stored this way already in sales_amount_net).</td>
    </tr>
    <tr>
      <td>order_total_tax</td>
      <td>FLOAT</td>
      <td>VAT or sales tax amount.</td>
    </tr>
    <tr>
      <td>order_total_discount</td>
      <td>FLOAT</td>
      <td>Order total discount.</td>
    </tr>
    <tr>
      <td>ts_previous_order</td>
      <td>TIMESTAMP</td>
      <td>The time of the previous order of this customer.</td>
    </tr>
    <tr>
      <td>ts_first_order</td>
      <td>TIMESTAMP</td>
      <td>The time of the first order of this customer.</td>
    </tr>
    <tr>
      <td>order_sequence</td>
      <td>INTEGER</td>
      <td>This is the sequence (frequency) of the current order_id for a given customer.</td>
    </tr>
    <tr>
      <td>order_recency</td>
      <td>INTEGER</td>
      <td>Recency in days since the last order for this customer.</td>
    </tr>
    <tr>
      <td>ts_delivery_scheduled</td>
      <td>TIMESTAMP</td>
      <td>The scheduled order delivery date and time. If a specific time window then this is set to the max of the timewindow. E.g., if 810 am on 1/7 is specified, then this is 20180701 10:00:00.</td>
    </tr>
    <tr>
      <td>ts_dispatch_scheduled</td>
      <td>TIMESTAMP</td>
      <td>Scheduled dispatch time.</td>
    </tr>
    <tr>
      <td>currency_code</td>
      <td>STRING</td>
      <td>ISO 3 letter code.</td>
    </tr>
    <tr>
      <td>customer_language</td>
      <td>STRING</td>
      <td>As set by customer on the website for preferred language, get via sales feed.</td>
    </tr>
    <tr>
      <td>customer_address_country</td>
      <td>STRING</td>
      <td>Customer's address country.</td>
    </tr>
    <tr>
      <td>customer_address_province</td>
      <td>STRING</td>
      <td>E.g., Texas for US, Scotland for UK.</td>
    </tr>
    <tr>
      <td>customer_address_county</td>
      <td>STRING</td>
      <td>E.g., Kent for UK.</td>
    </tr>
    <tr>
      <td>customer_address_city</td>
      <td>STRING</td>
      <td>Customer's address city.</td>
    </tr>
    <tr>
      <td>customer_address_postal_code</td>
      <td>STRING</td>
      <td>Customer's address postal code.</td>
    </tr>
    <tr>
      <td>customer_address_line1</td>
      <td>STRING</td>
      <td>Customer's address line 1.</td>
    </tr>
    <tr>
      <td>customer_address_line2</td>
      <td>STRING</td>
      <td>Customer's address line 2.</td>
    </tr>
    <tr>
      <td>delivery_address_country</td>
      <td>STRING</td>
      <td>ISO 2 letter code.</td>
    </tr>
    <tr>
      <td>delivery_address_province</td>
      <td>STRING</td>
      <td>Delivery address province.</td>
    </tr>
    <tr>
      <td>delivery_address_county</td>
      <td>STRING</td>
      <td>Delivery address county.</td>
    </tr>
    <tr>
      <td>delivery_address_city</td>
      <td>STRING</td>
      <td>Delivery address city.</td>
    </tr>
    <tr>
      <td>delivery_address_locality</td>
      <td>STRING</td>
      <td>Delivery address locality.</td>
    </tr>
    <tr>
      <td>delivery_address_postal_code</td>
      <td>STRING</td>
      <td>Delivery address postal code.</td>
    </tr>
    <tr>
      <td>fulfillment_company</td>
      <td>STRING</td>
      <td>Fulfillment company.</td>
    </tr>
    <tr>
      <td>fulfillment_branch</td>
      <td>STRING</td>
      <td>Fulfillment branch.</td>
    </tr>
    <tr>
      <td>carrier</td>
      <td>STRING</td>
      <td>Carrier.</td>
    </tr>
    <tr>
      <td>order_rating</td>
      <td>INTEGER</td>
      <td>On a 15 scale.</td>
    </tr>
    <tr>
      <td>order_review_text</td>
      <td>STRING</td>
      <td>Order review text.</td>
    </tr>
    <tr>
      <td>product_name</td>
      <td>STRING</td>
      <td>Product name.</td>
    </tr>
    <tr>
      <td>product_sku</td>
      <td>STRING</td>
      <td>Product SKU.</td>
    </tr>
    <tr>
      <td>product_sku_base</td>
      <td>STRING</td>
      <td>The product SKU parent or template.</td>
    </tr>
    <tr>
      <td>product_type</td>
      <td>STRING</td>
      <td>Product type.</td>
    </tr>
    <tr>
      <td>product_is_addon</td>
      <td>BOOLEAN</td>
      <td>Is product an addon.</td>
    </tr>
    <tr>
      <td>product_price</td>
      <td>FLOAT</td>
      <td>Gross product price before any discount or tax, typically what is displayed in product_views.</td>
    </tr>
    <tr>
      <td>product_price_net</td>
      <td>FLOAT</td>
      <td>Net sales amount per product, i.e., product_price minus tax and discount (the accounting price).</td>
    </tr>
    <tr>
      <td>product_quantity</td>
      <td>INTEGER</td>
      <td>Product quantity.</td>
    </tr>
    <tr>
      <td>product_rating</td>
      <td>INTEGER</td>
      <td>On a 15 scale.</td>
    </tr>
    <tr>
      <td>product_review_text</td>
      <td>STRING</td>
      <td>Product review text.</td>
    </tr>
    <tr>
      <td>session_id</td>
      <td>STRING</td>
      <td>Session id.</td>
    </tr>
 <tr>
      <td>subscription_order_id</td>
      <td>STRING</td>
      <td>Subscription order id.</td>
    </tr>
    <tr>
      <td>page_view_id</td>
      <td>STRING</td>
      <td>Page view id.</td>
    </tr>
    <tr>
      <td>page_type</td>
      <td>STRING</td>
      <td>Page type.</td>
    </tr>
    <tr>
      <td>page_language</td>
      <td>STRING</td>
      <td>Page language.</td>
    </tr>
    <tr>
      <td>page_title</td>
      <td>STRING</td>
      <td>Meta title of the page.</td>
    </tr>
    <tr>
      <td>url_path</td>
      <td>STRING</td>
      <td>URL without the querystring.</td>
    </tr>
    <tr>
      <td>url_host</td>
      <td>STRING</td>
      <td>URL host.</td>
    </tr>
    <tr>
      <td>url_query</td>
      <td>STRING</td>
      <td>URL query.</td>
    </tr>
    <tr>
      <td>url_fragment</td>
      <td>STRING</td>
      <td>URL fragment.</td>
    </tr>
    <tr>
      <td>site_search_query</td>
      <td>STRING</td>
      <td>Site search query.</td>
    </tr>
    <tr>
      <td>impression_placement</td>
      <td>STRING</td>
      <td>Impression placement.</td>
    </tr>
    <tr>
      <td>impression_row</td>
      <td>INTEGER</td>
      <td>Impression row.</td>
    </tr>
    <tr>
      <td>impression_column</td>
      <td>INTEGER</td>
      <td>Impression column.</td>
    </tr>
    <tr>
      <td>experiment</td>
      <td>STRING</td>
      <td>Experiment.</td>
    </tr>
    <tr>
      <td>experiment_variant</td>
      <td>STRING</td>
      <td>Experiment variant.</td>
    </tr>
    <tr>
      <td>campaign_media_type</td>
      <td>STRING</td>
      <td>Campaign media type.</td>
    </tr>
    <tr>
      <td>campaign_source</td>
      <td>STRING</td>
      <td>Campaign source.</td>
    </tr>
    <tr>
      <td>campaign_medium</td>
      <td>STRING</td>
      <td>Campaign medium.</td>
    </tr>
    <tr>
      <td>campaign_type</td>
      <td>STRING</td>
      <td>Campaign type.</td>
    </tr>
    <tr>
      <td>campaign</td>
      <td>STRING</td>
      <td>Campaign.</td>
    </tr>
    <tr>
      <td>campaign_content</td>
      <td>STRING</td>
      <td>Campaign content.</td>
    </tr>
    <tr>
      <td>campaign_keyword</td>
      <td>STRING</td>
      <td>Campaign keyword.</td>
    </tr>
    <tr>
      <td>campaign_search_query</td>
      <td>STRING</td>
      <td>Campaign search query.</td>
    </tr>
    <tr>
      <td>campaign_click_id</td>
      <td>STRING</td>
      <td>Campaign click id.</td>
    </tr>
    <tr>
      <td>sales_promotion_campaign</td>
      <td>STRING</td>
      <td>Sales promotion campaign.</td>
    </tr>
    <tr>
      <td>sales_promotion_campaign_type</td>
      <td>STRING</td>
      <td>Sales promotion campaign type.</td>
    </tr>
    <tr>
      <td>sales_promotion_code</td>
      <td>STRING</td>
      <td>Sales promotion code.</td>
    </tr>
    <tr>
      <td>sales_promotion_medium</td>
      <td>STRING</td>
      <td>Sales promotion medium.</td>
    </tr>
    <tr>
      <td>sales_promotion_discount_type</td>
      <td>STRING</td>
      <td>Sales promotion discount type.</td>
    </tr>
    <tr>
      <td>ticket_id</td>
      <td>STRING</td>
      <td>Ticket id.</td>
    </tr>
    <tr>
      <td>ticket_type</td>
      <td>STRING</td>
      <td>Ticket type.</td>
    </tr>
    <tr>
      <td>ticket_text</td>
      <td>STRING</td>
      <td>Ticket text.</td>
    </tr>
    <tr>
      <td>ip_address</td>
      <td>STRING</td>
      <td>IP address.</td>
    </tr>
    <tr>
      <td>user_agent</td>
      <td>STRING</td>
      <td>User agent.</td>
    </tr>
    <tr>
      <td>ip_number</td>
      <td>INTEGER</td>
      <td>IP address represented as an integer.</td>
    </tr>
    <tr>
      <td>ip_continent</td>
      <td>STRING</td>
      <td>IP continent.</td>
    </tr>
    <tr>
      <td>ip_timezone</td>
      <td>STRING</td>
      <td>IP timezone.</td>
    </tr>
    <tr>
      <td>ip_country_code</td>
      <td>STRING</td>
      <td>IP country code.</td>
    </tr>
    <tr>
      <td>ip_country</td>
      <td>STRING</td>
      <td>IP country.</td>
    </tr>
    <tr>
      <td>ip_province</td>
      <td>STRING</td>
      <td>IP province.</td>
    </tr>
    <tr>
      <td>ip_county</td>
      <td>STRING</td>
      <td>IP county.</td>
    </tr>
    <tr>
      <td>ip_town</td>
      <td>STRING</td>
      <td>IP town.</td>
    </tr>
    <tr>
      <td>ip_postal_code</td>
      <td>STRING</td>
      <td>IP postal code.</td>
    </tr>
<tr>
      <td>ip_longitude</td>
      <td>FLOAT</td>
      <td>IP longitude.</td>
    </tr>
    <tr>
      <td>ip_latitude</td>
      <td>FLOAT</td>
      <td>IP latitude.</td>
    </tr>
    <tr>
      <td>ip_organization</td>
      <td>STRING</td>
      <td>IP organization.</td>
    </tr>
    <tr>
      <td>ip_is_proxy</td>
      <td>BOOLEAN</td>
      <td>Is IP a proxy.</td>
    </tr>
    <tr>
      <td>os_family</td>
      <td>STRING</td>
      <td>OS family.</td>
    </tr>
    <tr>
      <td>os_name</td>
      <td>STRING</td>
      <td>OS name.</td>
    </tr>
    <tr>
      <td>browser_family</td>
      <td>STRING</td>
      <td>Browser family.</td>
    </tr>
    <tr>
      <td>browser_version</td>
      <td>STRING</td>
      <td>Browser version.</td>
    </tr>
    <tr>
      <td>browser_language</td>
      <td>STRING</td>
      <td>Browser language.</td>
    </tr>
    <tr>
      <td>browser_width</td>
      <td>INTEGER</td>
      <td>Width in pixels of the browser window.</td>
    </tr>
    <tr>
      <td>browser_height</td>
      <td>INTEGER</td>
      <td>Height in pixels of the browser window.</td>
    </tr>
    <tr>
      <td>browser_pixels</td>
      <td>FLOAT</td>
      <td>Total number of pixels, width and height of the browser divided by 1,000,000 (i.e., MegaPixels).</td>
    </tr>
    <tr>
      <td>device_type</td>
      <td>STRING</td>
      <td>Device type.</td>
    </tr>
    <tr>
      <td>device_screen_width</td>
      <td>INTEGER</td>
      <td>Width in pixels of the device screen.</td>
    </tr>
    <tr>
      <td>device_screen_height</td>
      <td>INTEGER</td>
      <td>Height in pixels of the device screen.</td>
    </tr>
    <tr>
      <td>device_screen_pixels</td>
      <td>FLOAT</td>
      <td>Total number of pixels, width and height of the device screen divided by 1,000,000 (i.e., MegaPixels).</td>
    </tr>
    <tr>
      <td>order_review_id</td>
      <td>STRING</td>
      <td>Order review id.</td>
    </tr>
    <tr>
      <td>product_review_id</td>
      <td>STRING</td>
      <td>Product review id.</td>
    </tr>
    <tr>
      <td>review_heading</td>
      <td>STRING</td>
      <td>Review heading.</td>
    </tr>
<tr>
      <td>review_sentiment</td>
      <td>FLOAT</td>
      <td>Review sentiment score 0-1.</td>
    </tr>
    <tr>
      <td>is_verified</td>
      <td>BOOLEAN</td>
      <td>Is the review done by a verified customer.</td>
    </tr>
    <tr>
      <td>preference</td>
      <td>STRING</td>
      <td>Marketing preference that customer has subscribed to.</td>
    </tr>
    <tr>
      <td>preference_medium</td>
      <td>STRING</td>
      <td>Marketing mediums subscribed to: email, sms.</td>
    </tr>
    <tr>
      <td>preference_frequency</td>
      <td>STRING</td>
      <td>How often can be marked to: daily, weekly, monthly.</td>
    </tr>
    <tr>
      <td>preference_delay_from</td>
      <td>DATE</td>
      <td>Delay marketing from date.</td>
    </tr>
    <tr>
      <td>preference_delay_to</td>
      <td>DATE</td>
      <td>Delay marketing to date.</td>
    </tr>
    <tr>
      <td>preference_unsubscribe_reason</td>
      <td>STRING</td>
      <td>Reason why customer has unsubscribed from marketing.</td>
    </tr>
    <tr>
      <td>preference_consent_text</td>
      <td>STRING</td>
      <td>Text which user has consented to.</td>
    </tr>
    <tr>
      <td>occasion</td>
      <td>STRING</td>
      <td>Occasion.</td>
    </tr>
    <tr>
      <td>gift_card_message</td>
      <td>STRING</td>
      <td>Gift card message.</td>
    </tr>
    <tr>
      <td>event_image_url</td>
      <td>STRING</td>
      <td>Event image URL.</td>
    </tr>
    <tr>
      <td>event_video_url</td>
      <td>STRING</td>
      <td>Event video URL.</td>
    </tr>
    <tr>
      <td>mention_comments_count</td>
      <td>INTEGER</td>
      <td>Mention comments count.</td>
    </tr>
    <tr>
      <td>mention_id</td>
      <td>STRING</td>
      <td>Mention id.</td>
    </tr>
    <tr>
      <td>mention_like_count</td>
      <td>INTEGER</td>
      <td>Mention like count.</td>
    </tr>
    <tr>
      <td>mention_sentiment</td>
      <td>FLOAT</td>
      <td>Mention sentiment.</td>
    </tr>
    <tr>
      <td>mention_share_count</td>
      <td>INTEGER</td>
      <td>Mention share count.</td>
    </tr>
    <tr>
      <td>mention_text</td>
      <td>STRING</td>
      <td>Mention text.</td>
    </tr>
    <tr>
      <td>order_review_reply</td>
      <td>STRING</td>
      <td>Order review reply.</td>
    </tr>
    <tr>
      <td>product_review_reply</td>
      <td>STRING</td>
      <td>Product review reply.</td>
    </tr>
    <tr>
      <td>survey_answer</td>
      <td>STRING</td>
      <td>Survey answer.</td>
    </tr>
    <tr>
      <td>survey_answer_id</td>
      <td>STRING</td>
      <td>Survey answer id.</td>
    </tr>
    <tr>
      <td>survey_id</td>
      <td>STRING</td>
      <td>Survey id.</td>
    </tr>
    <tr>
      <td>survey_options</td>
      <td>STRING</td>
      <td>Survey options.</td>
    </tr>
    <tr>
      <td>survey_question</td>
      <td>STRING</td>
      <td>Survey question.</td>
    </tr>
    <tr>
      <td>survey_question_id</td>
      <td>STRING</td>
      <td>Survey question id.</td>
    </tr>
    <tr>
      <td>survey_question_shown</td>
      <td>BOOLEAN</td>
      <td>Survey question shown.</td>
    </tr>
    <tr>
      <td>survey_question_type</td>
      <td>STRING</td>
      <td>Survey question type.</td>
    </tr>
    <tr>
      <td>survey_response_time</td>
      <td>INTEGER</td>
      <td>Survey response time.</td>
    </tr>
    <tr>
      <td>survey_response_id</td>
      <td>STRING</td>
      <td>Survey response id.</td>
    </tr>
    <tr>
      <td>survey_status</td>
      <td>STRING</td>
      <td>Survey status.</td>
    </tr>
    <tr>
      <td>count_stacktome_email_sent</td>
      <td>INTEGER</td>
      <td>Count of Stacktome email sent.</td>
    </tr>
    <tr>
      <td>email_send_type</td>
      <td>STRING</td>
      <td>Email send type.</td>
    </tr>
    <tr>
      <td>ticket_subject</td>
      <td>STRING</td>
      <td>Ticket subject.</td>
    </tr>
    <tr>
      <td>ticket_requester_id</td>
      <td>STRING</td>
      <td>Ticket requester id.</td>
    </tr>
    <tr>
      <td>ticket_assignee_id</td>
      <td>STRING</td>
      <td>Ticket assignee id.</td>
    </tr>
    <tr>
      <td>ticket_assignee_email</td>
      <td>STRING</td>
      <td>Ticket assignee email.</td>
    </tr>
    <tr>
      <td>ticket_status</td>
      <td>STRING</td>
      <td>Ticket status.</td>
    </tr>
    <tr>
      <td>ticket_tags</td>
      <td>STRING</td>
      <td>Ticket tags.</td>
    </tr>
    <tr>
      <td>ticket_fields</td>
      <td>RECORD</td>
      <td>Ticket fields.</td>
    </tr>
    <tr>
    <td>ticket_rating</td>
      <td>INTEGER</td>
      <td>Ticket rating.</td>
    </tr>
    <tr>
      <td>ticket_review_text</td>
      <td>STRING</td>
      <td>Ticket review text.</td>
    </tr>
    <tr>
      <td>campaign_id</td>
      <td>STRING</td>
      <td>Campaign id.</td>
    </tr>
    <tr>
      <td>product_cost</td>
      <td>FLOAT</td>
      <td>Product cost.</td>
    </tr>
    <tr>
      <td>order_total_cost</td>
      <td>FLOAT</td>
      <td>Order total cost.</td>
    </tr>
  </table>
</details>