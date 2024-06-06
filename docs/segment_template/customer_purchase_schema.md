# Customer Purchase Schema
	
app_id                      STRING - Generally, this should match the domain name without the TLD, e.g., serenataflowers, hipper.

customer_key                STRING - This is set by UDF: generate key(email, mobile, customer_id).

email                       STRING - Email address of the customer.

email_hash                  STRING - To get hash as a text string from email address: to_hex(sha256(email_address)).

email_valid_format          BOOLEAN - Flag for valid email format.

email_organization          STRING - Organization or domain part of the customer's email address, e.g., gmail, hotmail, live, outlook.

email_tld                   STRING - Top-level domain of the customer's email address, e.g., co.uk, .com, .net.

mobile                      STRING - Mobile number of the customer.

first_name                  STRING - First name of the customer.

last_name                   STRING - Last name of the customer.

gender_derived              STRING - Uses lookup table: 'sfhipper.pa.gender` (we should move this elsewhere) based on first_name.

full_name                   STRING - Concatenated first and last. May also contain 'title'.

customer_id                 STRING - Customer id as per business source.

ts_event                    TIMESTAMP - Generally the time the event took place, i.e., not ingestion time.

ts_inserted                 TIMESTAMP - The timestamp of the ETL.

visitor_id                  STRING - From clickstream visitor_domain_id_src which is the snowplow: visitor_domain_id column.

visitor_network_id          STRING - The network_id is nondomain specific, i.e., 3rd party cookie_id.

event_type                  STRING - Clickstream, purchase, review, page, email, ticket.

event_subtype               STRING - View, landing, click (on site action), impression, order_review, product_review.

event                       STRING - Generally for clickstream events and email (TBD) only: page_view, page_landing, product_view, product_click, product_landing, checkout_view, add_to_cart, checkout_landing, order_confirmation_view, blog_view, blog_landing, campaign_impression, experiment_impression, email_send, email_impression, email_unsubscribe, email_subscribe, email_bounce, product_impression ie. from clickstream_log.event_action.

event_source                STRING - For clickstream events, this is: relative_url_domain_org (domain, less tld) (e.g., google for external clicks, serenataflowers for internal). For non-clickstream events, we set this to the data source, e.g., feefo, trustpilot.

event_source_url            STRING - This is 'relative_url_path' from clickstream_log, i.e., the referring URL, less the query string. NULL for other events.

event_source_host           STRING - This is 'relative_url_host' from clickstream_log, i.e., the referring host. NULL for other events.

order_id                    STRING - Identifier of the order.

order_number                STRING - Order number.

order_name                  STRING - Order name.

orderline_id                STRING - Identifier of the orderline.

order_total_net             FLOAT - Order total is always the sum of all order lines Net Revenue, AFTER discount and Tax (currently sales data is stored this way already in sales_amount_net).

order_total_tax             FLOAT - VAT or sales tax amount.

order_total_discount        FLOAT - Order total discount.

ts_previous_order           TIMESTAMP - The time of the previous order of this customer.

ts_first_order              TIMESTAMP - The time of the first order of this customer.

order_sequence              INTEGER - This is the sequence (frequency) of the current order_id for a given customer.

order_recency               INTEGER - Recency in days since the last order for this customer.

ts_delivery_scheduled       TIMESTAMP - The scheduled order delivery date and time. If a specific time window then this is set to the max of the timewindow. E.g., if 810 am on 1/7 is specified, then this is 20180701 10:00:00.

ts_dispatch_scheduled       TIMESTAMP - Scheduled dispatch time.

currency_code               STRING - ISO 3 letter code.

customer_language           STRING - As set by customer on the website for preferred language, get via sales feed.

customer_address_country    STRING - Customer's address country.

customer_address_province   STRING - E.g., Texas for US, Scotland for UK.

customer_address_county     STRING - E.g., Kent for UK.

customer_address_city       STRING - Customer's address city.

customer_address_postal_code STRING - Customer's address postal code.

customer_address_line1      STRING - Customer's address line 1.

customer_address_line2      STRING - Customer's address line 2.

delivery_address_country    STRING - ISO 2 letter code.

delivery_address_province   STRING - Delivery address province.

delivery_address_county     STRING - Delivery address county.

delivery_address_city       STRING - Delivery address city.

delivery_address_locality   STRING - Delivery address locality.

delivery_address_postal_code STRING - Delivery address postal code.

fulfillment_company         STRING - Fulfillment company.

fulfillment_branch          STRING - Fulfillment branch.

carrier                     STRING - Carrier.

order_rating                INTEGER - On a 15 scale.

order_review_text           STRING - Order review text.

product_name                STRING - Product name.

product_sku                 STRING - Product SKU.

product_sku_base            STRING - The product SKU parent or template.

product_type                STRING - Product type.

product_is_addon            BOOLEAN - Is product an addon.

product_price               FLOAT - Gross product price before any discount or tax, typically what is displayed in product_views.

product_price_net           FLOAT - Net sales amount per product, i.e., product_price minus tax and discount (the accounting price).

product_quantity            INTEGER - Product quantity.

product_rating              INTEGER - On a 15 scale.

product_review_text         STRING - Product review text.

session_id                  STRING - Session id.

subscription_order_id       STRING - Subscription order id.

page_view_id                STRING - Page view id.

page_type                   STRING - Page type.

page_language               STRING - Page language.

page_title                  STRING - Meta title of the page.

url_path                    STRING - URL without the querystring.

url_host                    STRING - URL host.

url_query                   STRING - URL query.

url_fragment                STRING - URL fragment.

site_search_query           STRING - Site search query.

impression_placement        STRING - Impression placement.

impression_row              INTEGER - Impression row.

impression_column           INTEGER - Impression column.

experiment                  STRING - Experiment.

experiment_variant          STRING - Experiment variant.

campaign_media_type         STRING - Campaign media type.

campaign_source             STRING - Campaign source.

campaign_medium             STRING - Campaign medium.

campaign_type               STRING - Campaign type.

campaign                    STRING - Campaign.

campaign_content            STRING - Campaign content.

campaign_keyword            STRING - Campaign keyword.

campaign_search_query       STRING - Campaign search query.

campaign_click_id           STRING - Campaign click id.

sales_promotion_campaign    STRING - Sales promotion campaign.

sales_promotion_campaign_type STRING - Sales promotion campaign type.

sales_promotion_code        STRING - Sales promotion code.

sales_promotion_medium      STRING - Sales promotion medium.

sales_promotion_discount_type STRING - Sales promotion discount type.

ticket_id                   STRING - Ticket id.

ticket_type                 STRING - Ticket type.

ticket_text                 STRING - Ticket text.

ip_address                  STRING - IP address.

user_agent                  STRING - User agent.

ip_number                   INTEGER - IP address represented as an integer.

ip_continent                STRING - IP continent.

ip_timezone                 STRING - IP timezone.

ip_country_code             STRING - IP country code.

ip_country                  STRING - IP country.

ip_province                 STRING - IP province.

ip_county                   STRING - IP county.

ip_town                     STRING - IP town.

ip_postal_code              STRING - IP postal code.

ip_longitude                FLOAT - IP longitude.

ip_latitude                 FLOAT - IP latitude.

ip_organization             STRING - IP organization.

ip_is_proxy                 BOOLEAN - Is IP a proxy.

os_family                   STRING - OS family.

os_name                     STRING - OS name.

browser_family              STRING - Browser family.

browser_version             STRING - Browser version.

browser_language            STRING - Browser language.

browser_width               INTEGER - Width in pixels of the browser window.

browser_height              INTEGER - Height in pixels of the browser window.

browser_pixels              FLOAT - Total number of pixels, width and height of the browser divided by 1,000,000 (i.e., MegaPixels).

device_type                 STRING - Device type.

device_screen_width         INTEGER - Width in pixels of the device screen.

device_screen_height        INTEGER - Height in pixels of the device screen.

device_screen_pixels        FLOAT - Total number of pixels, width and height of the device screen divided by 1,000,000 (i.e., MegaPixels).

order_review_id             STRING - Order review id.

product_review_id           STRING - Product review id.

review_heading              STRING - Review heading.

review_sentiment            FLOAT - Review sentiment score 0-1.

is_verified                 BOOLEAN - Is the review done by a verified customer.

preference                  STRING - Marketing preference that customer has subscribed to.

preference_medium           STRING - Marketing mediums subscribed to: email, sms.

preference_frequency        STRING - How often can be marked to: daily, weekly, monthly.

preference_delay_from       DATE - Delay marketing from date.

preference_delay_to         DATE - Delay marketing to date.

preference_unsubscribe_reason STRING - Reason why customer has unsubscribed from marketing.

preference_consent_text     STRING - Text which user has consented to.

occasion                    STRING - Occasion.

gift_card_message           STRING - Gift card message.

event_image_url             STRING - Event image URL.

event_video_url             STRING - Event video URL.

mention_comments_count      INTEGER - Mention comments count.

mention_id                  STRING - Mention id.

mention_like_count          INTEGER - Mention like count.

mention_sentiment           FLOAT - Mention sentiment.

mention_share_count         INTEGER - Mention share count.

mention_text                STRING - Mention text.

order_review_reply          STRING - Order review reply.

product_review_reply        STRING - Product review reply.

survey_answer               STRING - Survey answer.

survey_answer_id            STRING - Survey answer id.

survey_id                   STRING - Survey id.

survey_options              STRING - Survey options.

survey_question             STRING - Survey question.

survey_question_id          STRING - Survey question id.

survey_question_shown       BOOLEAN - Survey question shown.

survey_question_type        STRING - Survey question type.

survey_response_time        INTEGER - Survey response time.

survey_response_id          STRING - Survey response id.

survey_status               STRING - Survey status.

count_stacktome_email_sent  INTEGER - Count of Stacktome email sent.

email_send_type             STRING - Email send type.

ticket_subject              STRING - Ticket subject.

ticket_requester_id         STRING - Ticket requester id.

ticket_assignee_id          STRING - Ticket assignee id.

ticket_assignee_email       STRING - Ticket assignee email.

ticket_status               STRING - Ticket status.

ticket_tags                 STRING - Ticket tags.

ticket_fields               RECORD - Ticket fields.

ticket_rating               INTEGER - Ticket rating.

ticket_review_text          STRING - Ticket review text.

campaign_id                 STRING - Campaign id.

product_cost                FLOAT - Product cost.

order_total_cost            FLOAT - Order total cost.
	

