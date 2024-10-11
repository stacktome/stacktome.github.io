# Campaign Workflow

Determines what steps should campaign be executing when a contact is matched for given campaign conditions.

## Invite campaign

* **Invite** - Generates a verified invitation link (Trustpilot, Feefo, Google) or use custom one if set and sends email to customer with a given email template and subject line. If several email or subject lines are set, then splits the sends based on given ratio for each template/subject line.

* **Reminder** - Send a reminder email with same link that was generated during invitation step after # of hours set in the delay field. You can set up to 9 reminders. However more reminders might not give any significant improvement on overall review rate.

## Response campaign

* **Response** - Sends a response email to the review that was left if it matches the condition of review rating. The email might have review link and other fields related to review itself. Several use cases for this:
    * A Basic thank you email
    * An incentive/reward email for leaving a review, when offering incentives to customers in the first invitation campaign. Note for this we recommend using segments if targetting specific customers to avoid incentivizing everyone.
    * Recovery campaign initial email, when targetting with a segment customers which negative reviews were resolved. In this case, you can ask customer to either update rating to positive or delete the review. Only recommended if customer is likely to be satisfied and forgot to change the review. This can also include incentive to ensure he/she completes the action.
* **Recovery** - Sent after customer has changed the review to a rating matching condition or deleted it. This can be a thank you email or incentive promised in the initial response or response reminder emails.
* **Reminder** - Reminder - A follow-up to the Response email for reminding customer to change the review rating or delete it. Can be up to 9 reminders.