# Campaign
* **Name** - The name of campaign - cannot be changed after creation
* **All Orders** - Send invites to all orders that match criteria
* **Segment** - Send invites only to specific customer segment. To create a segment go to "Marketing Segment" menu item. 
    * Type segment name to select a segment.
    * The campaign will execute send steps to all contacts in the segment until max email send limit is reached.
* **Targers** - Determines which platforms should be used for creating an invitation link. When multiple platforms are selected the send happens in a round-robin fashion, meaning sends are done sequentaly for each. 
* **Custom invite link** - When selecting a custom target, you need to provide a valid static invitation link which will be set in the email.
* **Country** - This determines the locale of the invitation form, only valid for Trustpilot target.
* **Custom unsubscribe link** - By default StackTome uses own unsubscribe form, however if you have your own preference center and would like to manage unsubscribes seperately, then you can set a link here. 
    * To identify the person unsubscribing you can add a placeholder after the link like follows: &userToken={{email_hash}} - where email_hash is email encoded as SHA256 hash, same standard used for Facebook & Google for matching email addresses.

* **Test mode** - Useful as a final test to check how email invites look like and verify if generated links are working as expected. Note that all test email sents are excluded from any criteria, meaning once you turn off test mode customers will still receive the invitations even if they were sent in test mode.
* **Test mode email** - The target email where all invites gonna be sent for all customers. 
* **Event timestamp field** - Used only when "All orders" is selected. Determines which timestamp field to use when calculating the delay of invite step. Ignored when segment is set.
    *  ts_delivery_scheduled - delay invitation send by X hours from the time when delivery has been done. For example delay=24 will wait 24 hours from the time of delivery when invitation is sent.
    *  ts_dispatch_scheduled - similar to delivery, but instead use dispatch (fullfillment) timestamp for delaying the invitation.
    *  ts_event - use order creation timestamp for scheduling delaying invitation step. (not recommended as not accurate)