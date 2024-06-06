# Customer Profile Schema

customer_key             STRING - Unique identifier for each customer.

first_name               STRING - First name of the customer.

last_name                STRING - Last name of the customer.

full_name                STRING - Full name of the customer.

email                    STRING - Email address of the customer.

email_hash               STRING - Hashed version of the customer's email address.

email_organization       STRING - Organization or domain part of the customer's email address.

email_tld                STRING - Top-level domain of the customer's email address.

mobile                   STRING - Mobile number of the customer.

gender_derived           STRING - Derived gender information of the customer.

first_order_id           STRING - Identifier of the customer's first order.

last_order_id            STRING - Identifier of the customer's last order.

app_id                   STRING - Identifier for the application.

count_purchase           INTEGER - Total number of purchases made by the customer.

monetary                 FLOAT - Total monetary value spent by the customer.

average_monetary         FLOAT - Average monetary value spent per purchase by the customer.

monetary_discount        FLOAT - Total monetary value of discounts applied to purchases made by the customer.

average_monetary_discount FLOAT - Average monetary value of discounts applied per purchase by the customer.

total_order_rating       INTEGER - Total rating given by the customer for all orders.

total_product_rating     INTEGER - Total rating given by the customer for all products.

total_product_price_viewed FLOAT - Total price of products viewed by the customer.

count_product_price_viewed INTEGER - Total number of times products' prices were viewed by the customer.

average_order_rating     FLOAT - Average rating given by the customer for orders.

average_product_rating   FLOAT - Average rating given by the customer for products.

average_product_price_viewed FLOAT - Average price of products viewed by the customer.

count_landing            INTEGER - Total number of landing page visits by the customer.

count_page_view          INTEGER - Total number of page views by the customer.

count_product_view       INTEGER - Total number of product views by the customer.

count_checkout_view      INTEGER - Total number of checkout views by the customer.

count_email_open         INTEGER - Total number of email opens by the customer.

count_email_click        INTEGER - Total number of email clicks by the customer.

count_campaign_click     INTEGER - Total number of campaign clicks by the customer.

count_order_review       INTEGER - Total number of order reviews by the customer.

count_product_review     INTEGER - Total number of product reviews by the customer.

count_unq_landing_page   INTEGER - Total number of unique landing pages visited by the customer.

count_unq_page_view      INTEGER - Total number of unique pages viewed by the customer.

count_unq_product_view   INTEGER - Total number of unique products viewed by the customer.

count_unq_checkout       INTEGER - Total number of unique checkout views by the customer.

count_unq_campaign_medium INTEGER - Total number of unique campaign mediums clicked by the customer.

ts_first_purchase        TIMESTAMP - Timestamp of the customer's first purchase.

ts_last_purchase         TIMESTAMP - Timestamp of the customer's last purchase.

ts_first_clickstream     TIMESTAMP - Timestamp of the first clickstream event by the customer.

ts_last_clickstream      TIMESTAMP - Timestamp of the last clickstream event by the customer.

ts_first_page_view       TIMESTAMP - Timestamp of the first page view by the customer.

ts_last_page_view        TIMESTAMP - Timestamp of the last page view by the customer.

ts_first_product_view    TIMESTAMP - Timestamp of the first product view by the customer.

ts_last_product_view     TIMESTAMP - Timestamp of the last product view by the customer.

ts_first_checkout        TIMESTAMP - Timestamp of the first checkout by the customer.

ts_last_checkout         TIMESTAMP - Timestamp of the last checkout by the customer.

ts_first_email_open      TIMESTAMP - Timestamp of the first email open by the customer.

ts_last_email_open       TIMESTAMP - Timestamp of the last email open by the customer.

ts_first_email_click     TIMESTAMP - Timestamp of the first email click by the customer.

ts_last_email_click      TIMESTAMP - Timestamp of the last email click by the customer.

ts_last_review           TIMESTAMP - Timestamp of the last review given by the customer.

ts_last_preference_change TIMESTAMP - Timestamp of the last preference change by the customer.

is_preference_opt_in     BOOLEAN - Indicates whether the customer has opted into preferences.

count_stacktome_email_sent INTEGER - Total number of emails sent by Stacktome to the customer.

ts_last_stacktome_email_sent TIMESTAMP - Timestamp of the last email sent by Stacktome to the customer.

count_stacktome_email_sent_last_ts TIMESTAMP - Total number of emails sent by Stacktome to the customer until the last timestamp.

last_stacktome_email_type STRING - Type of the last email sent by Stacktome to the customer.

ts_last_campaign_click   TIMESTAMP - Timestamp of the last campaign click by the customer.

last_campaign_source     STRING - Source of the last campaign clicked by the customer.

last_campaign_click_id   STRING - Identifier of the last campaign clicked by the customer.

