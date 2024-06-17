# Segments Edit Page

* Events: This is a multi-item dropdown selector, similar to ticket sources. Choices include: Purchase, Clickstream, Review, Preference, Survey and Ticket. At least one option must be selected.
1. customer_clickstream: This event represents the sequence of actions taken by customers while interacting with our platform, following the process of stitching together user identities.
2. customer_preferences: This event records customer preferences, such as product preferences, communication channel preferences, marketing preferences, and any other relevant preferences expressed by the customer.
3. customer_purchase: This event involves the recording of customer transactions. They undergo transformations to calculate metrics such as recency, frequency, and total order value.
4. customer_review: This event captures customer reviews sourced directly from platforms like Feefo and Trustpilot. These reviews are linked to specific sales events to provide insights into order details.
5. customer_survey: Information from customer survey responses is captured within this event. Currently sourced from Alchemer, it provides valuable insights into customer feedback and preferences.
6. customer_ticket: This event pertains to customer support tickets. Involve recording details of customer inquiries, issues, or requests for assistance.

* Targets: This is a multi-item dropdown selector, similar to ticket sources. Choices include: Google Ads, Facebook, Mailchimp, and Dotmailer. Each option displays both the name and icon. At least one option must be selected.

* Type: This is a radio button toggle selector between SQL and Template. SQL is the default selection.
1. If "SQL" is selected, it indicates that the segment will be defined using SQL. Users can write custom SQL queries to specify the criteria for segmenting their data.
2. If "Template" is selected, it indicates that the segment will be created using pre-defined templates provided by the platform. 
