# Sender settings

Configure your sender details and authorize to use your domain for sending emails with StackTome invitation campaigns.

To do this DNS records need to be added that allows our ESP (Email Service Provider) to use your domain.

* **Sender Name** - The name that will appear on customers' inbox. Usually you want to have your brands name same as you would be sending your own emails like newsletters or promotions.
* **Sender Address** - the email address (must be set without domain) that customers' see in their inbox. For example noreply.invitations will result in email address as noreply.invitations@yourdomain.com. 
    * You Can use both a valid inbox address or an invalid one.
    * Note sender address is used match and fetch email send statistics, therefore if it is change the email address here, the statistics of previous sends won't be visible in the invite report.
* **Reply to** (currently not supported) - The address customer can used to reply. Can be helpful when you don't want to change the sending address, but want to use different reply address to give customers ability to respond to emails.
* **Sender domain** - The actual domain used to send emails to customers. 
    * When setting the domain first time, click save after changing it. This will add it to ESP for verification purposes.

## Verify

To Verify a domain you need to set 4 variables:

* mandrill verification code TXT record - this proofs to ESP that you own the domain. 
* _dmarc - new Googles' requirement that prevents anyone using your domain to send emails, meaning they get rejected when DMARC is enforced.
* CNAME mte1 & mte2 - signature encryption keys used by ESP to sign emails that are being sent through your domain.

To be able to send emails using StackTome you need to set all 4 records and click verify button. If records where set correctly the status icon near the domain will turn to checkmark instead of X. If some record was not set correctly you will see X near that record.

Note sometimes the mandrill TXT record sometimes returns invalid (X) even when it set correctly until mte records are added. Therefore make sure you configure all records before revalidating.

Here is a quick tutorial how this can be configured on Google DNS:

<iframe width="640" height="364" src="https://www.loom.com/embed/00a542330d5e4269884c057eff6ce050?sid=153f211f-7674-45e2-8fc7-e7d6e6717372" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
