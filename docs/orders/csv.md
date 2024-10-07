Following schema is supported for importing CSV files, bolded columns are required.

For an example file see <a href="https://support.stacktome.com/orders/partial_sales_sample_2023-07-18.csv" target="_blank">here</a>.

| Column Name                      | Data Type | Description                                                                                   |
|----------------------------------|-----------|-----------------------------------------------------------------------------------------------|
| **order_id**                         | STRING    |                                                                                               |
| **order_item_id**                    | STRING    |                                                                                               |
| **created_at**                       | TIMESTAMP | when order was created, UTC ISO format                                                        |
| **order_item_name**                  | STRING    | the name of product                                                                           |
| order_item_net_price             | FLOAT     |                                                                                               |
| order_item_gross_price           | FLOAT     |                                                                                               |
| order_item_quantity              | INTEGER   | how many products bought                                                                      |
| **customer_first_name**              | STRING    |                                                                                               |
| customer_last_name               | STRING    |                                                                                               |
| **customer_email**                   | STRING    |                                                                                               |
| customer_mobile                  | STRING    |                                                                                               |
| customer_id                      | STRING    |                                                                                               |
| order_item_product_sku           | STRING    | specific product id that was sold                                                             |
| order_item_product_sku_base      | STRING    | similar to product_core_id                                                                    |
| order_item_product_type          | STRING    | product type                                                                                  |
| order_item_is_add_on             | BOOLEAN   | if order item can be bought only with something else                                          |
| order_item_tax                   | FLOAT     | Describe this field...                                                                        |
| order_item_discount              | FLOAT     | Describe this field...                                                                        |
| order_item_category              | STRING    | Describe this field...                                                                        |
| order_item_brand                 | STRING    | Describe this field...                                                                        |
| order_item_currency              | STRING    | 3 character ISO currency code (e.g. USD, GBP, EUR, JPY, SEK)                                  |
| delivery_address_country         | STRING    | Describe this field...                                                                        |
| delivery_address_city            | STRING    | Describe this field...                                                                        |
| delivery_address_po              | STRING    | Describe this field...                                                                        |
| website_domain                   | STRING    | Describe this field...                                                                        |
| promotion_code                   | STRING    | sometimes referred to as 'voucher code' or 'discount code'                                    |
| promotion_name                   | STRING    |                                                                                               |
| promotion_campaign               | STRING    | sometimes referred to as the 'voucher campaign'                                               |
| promotion_campaign_type          | STRING    | e.g. acquisition, retention, loyal                                                            |
| promotion_discount_type          | STRING    | percent, money-off                                                                            |
| promotion_customer_type          | STRING    | e.g. web, email, sms, insert                                                                  |
| promotion_medium                 | STRING    | e.g. affiliate, a amazon, hellofresh                                                         |
| promotion_source                 | STRING    | when the order was confirmed - usually this is the same as created, but if in some cases there is longer delay between creation and confirmation this field could be used for additional date |
| **confirmed_at**                     | TIMESTAMP |                                                                                               |
| scheduled_delivery_at            | TIMESTAMP | when order was delivered, UTC ISO format                                                      |
| **scheduled_dispatch_at**            | TIMESTAMP | when order was sent, UTC ISO format                                                           |
| carrier_service_name             | STRING    | e.g. DPD                                                                                      |
| fulfillment_company              | STRING    | e.g. AM delivery                                                                              |
| fulfillment_branch               | STRING    | e.g. 'Amazon 3rd party', partner1/2/3 75                                                      |
| fulfillment_branch_code          | STRING    | e.g. 608 - needed for extra filtering on recs for cases like e-florist same day delivery flowers - eventually could be moved to product_log |
| user_agent                       | STRING    | user agent usually provided by browser                                                        |
| ip_number                        | STRING    | e.g. 1329654327 (32 bit representation of ip)                                                 |
| ip_address                       | STRING    | e.g. 79.64.234.55 (ip address)                                                                |
| type                             | STRING    | sale, refund, redeliver                                                                       |
| subscription_item_id             | FLOAT     | if not available use order_item_id - unique identifier when multiple payments can be done per order item |
| order_item_cost                  | FLOAT     | item internal cost value                                                                       |
| customer_language                | STRING    | referring customer language                                                                    |
| subscription_order_id            | STRING    | identifier of recurring order                                                                  |