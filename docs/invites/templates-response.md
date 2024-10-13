# Template type - Response

Email template that is used only in response campaigns for  response, recovery & reminder steps. As a placeholder review data object is used. To add a placeholder value, click on any text area in the email and click on "Merge TaInvitegs" - as alternative you can use {{field_name}}, for example {{first_name}} - would be replace with customer Firstname. Here is a list of available fields:
* **{{first_name}}** - Firstname of customer
* **{{last_name}}** - Lastname of customer
* **{{order_id}}** - Order ID that was made by customer
* **{{order_timestamp}}** - Timestamp when order was created
* **{{review_link}}** - Link to the review left - useful when want to ask customer to change the review
* **{{review_heading}}** - The title of the review
* **{{review_text}}** - The full review text 
* **{{review_rating}}** - Rating that was left for the review 1-5
* **{{review_timestamp}}** - When the review was left
* **R** **{{unsub unsubscribe_link}}** - Unsubscribe link, generated automatically, unless setting a custom unsubscribe link in the campaign. In which case adding as query param {{email_hash}} is required to identify the email, required
* **{{email_hash}}** - Customers Email address hashed as SHA256, useful when need to identify customer in a safe way without exposing actual email address

**R** marked fields are required. 

    
For more information on more capabilities for placeholder values see: https://mailchimp.com/developer/transactional/docs/templates-dynamic-content/