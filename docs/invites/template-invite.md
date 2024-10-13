# Template type - Invite

Email template that is available only in invitation campaigns for both invite & reminder step. To add a placeholder value, click on any text area in the email and click on "Merge TaInvitegs" - as alternative you can use {{field_name}}, for example {{first_name}} - would be replace with customer Firstname. Here is a list of available fields:

* **{{first_name}}** - Firstname of customer
* **{{last_name}}** - Lastname of customer
* **{{order_id}}** - Order ID that was made by customer
* **{{order_timestamp}}** - Timestamp when order was created
*  **R** **{{review_invite_link}}** - The link to leave a review, generated by the campaign, required
* **{{review_target}}** - From which platform review is being requested
* **R** **{{unsub unsubscribe_link}}** - Unsubscribe link, generated automatically, unless setting a custom unsubscribe link in the campaign. In which case adding as query param {{email_hash}} is required to identify the email, required
* **{{email_hash}}** - Customers Email address hashed as SHA256, useful when need to identify customer in a safe way without exposing actual email address
* **{{#if products}}{{#each products}}{{/each}}{{/if}}** - To Place info for each product purchased in the email and/or add product invite links
    * **{{brand}}** - Product brand
    * **{{image_url}}** - Image url for the product that can be placed in the email as thumbnail (taken from GS (Google Shopping) product feed)
    * **{{name}}** - Product name (GS feed)
    * **{{product_review_invite_link}}** - Product review invite link, generated by the campaign
    * **{{product_url}}** - Link to product where it was purchased (GS feed)
    * **{{sku}}** - SKU of the product (GS feed)

**R** marked fields are required. 

For more information on more capabilities for placeholder values see: https://mailchimp.com/developer/transactional/docs/templates-dynamic-content/