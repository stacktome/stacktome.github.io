# Trustpilot Connection

This page describes connection workflows with Trustpilot.

## Using Custom API credentials

To connect with customer API credentials follow these steps:
1. Create an app for customer API credentials on Trustpilot on this page: https://businessapp.b2b.trustpilot.com/applications/
- set name as StackTome for example
- set redirect urls exactly as:
- - https://app.stacktome.com
- - https://services.stacktome.com
- - https://services.stacktome.com/auth/v1/trustpilot
- Save the app
2. Open StackTome conections page and click connect on Trustpilot. 
3. Copy the API key and API secret in the fields
4. Click save and login to your Trustpilot account after page reload
5. Approve login on your email and wait for StackTome app to load
6. If you have multiple Trustpilot accounts, choose the one to connect to.
Note, ignore the empty fields for API key/secret as they are set automatically after Trustpilot redirect.

Here is a tutorial how to do it:

<iframe width="640" height="364" src="https://www.loom.com/embed/e1dc0ac63ea8492ca5be29779ae8b30c" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

## Connecting Trustpilot to StackTome via Forwarding Email (ConnectAsUser)

This guide provides step-by-step instructions on how to connect **Trustpilot** to **StackTome** using the **ConnectAsUser** feature. This method is especially useful if you are on a free account and cannot add additional users directly. 

Instead, you will set up an email forwarding rule (using Google/Gmail as an example) to route your Trustpilot login verification emails to your dedicated StackTome group email address.

---

## Prerequisites
* A valid **Trustpilot** account.
* Your dedicated **StackTome** account group email address (e.g., `hipper@stacktome.com`).
* Access to both your original Gmail inbox and your StackTome group email inbox.

---

## Step-by-Step Instructions

### Step 1: Add the StackTome Forwarding Address in Gmail
Before creating an automated filter, you must authorize Gmail to forward messages to your StackTome email.

1. Open your Gmail settings and navigate to the **Forwarding and POP/IMAP** tab - https://mail.google.com/mail/u/0/#settings/fwdandpop.
2. Click on **Add a forwarding address**.
3. Enter your special StackTome email address (e.g., `hipper@StackTome.com`) and click **Next**.
4. If prompted by Google's security measures (such as Two-Factor Authentication), complete the verification using your mobile device or verification code.
5. Click **Proceed** to send the forwarding request.

### Step 2: Approve the Forwarding Request in StackTome
Google requires a confirmation from the receiving email inbox before forwarding can begin.

1. Go to your **StackTome group email inbox** - example: https://groups.google.com/u/0/a/stacktome.com/g/{account_name} 
- replace {account_name} with your account_name in https://app.stacktome.com/profile.

2. Look for the official confirmation email from Google regarding email forwarding.
3. Open the email and click the **Confirmation Link** inside to approve and accept the forwarding relationship.

### Step 3: Create the Automated Forwarding Filter
Once approved, return to your original Gmail account to set up the automated rule for Trustpilot login emails.

1. Create filter as follows: https://mail.google.com/mail/u/0/#create-filter/from=noreply.login%40trustpilot.com&sizeoperator=s_sl&sizeunit=s_smb
2. Click **Create filter**.
3. Check the box for **Forward it to:** and select your verified StackTome email address from the dropdown list.
6. *(Optional)* If Google prompts you for Two-Factor Authentication verification again, complete it to finalize the rule.
7. Click **Create filter** to activate the automation.

> **Note:** If your newly approved email does not appear in the dropdown list immediately, refresh your Gmail browser tab and try creating the filter again.

---

## Step 4: Verify the Setup
1. Go to the Trustpilot login screen and request a fresh login verification email.
2. Confirm that the login email arrives in your primary Gmail inbox.
3. Open your **StackTome group inbox** and verify that the exact same login email was successfully forwarded and received.

---

## Step 5: Connect inside StackTome (Optional) - Can ask support to do it
1. Within your StackTome dashboard, use your dedicated StackTome email address to initiate the connection.
2. Select the appropriate **Country** you normally use for connecting to Trustpilot.
3. Proceed with **ConnectAsUser**. The system will now automatically capture the forwarded login tokens, and your integration should function smoothly.

---

## Troubleshooting & Support
* **Forwarding email not showing up?** Refresh your browser window after confirming the link in Step 2. Google sometimes requires a hard refresh to update the authorized forwarding dropdown.
* **Two-Factor Authentication Prompts:** Google may ask for security verification multiple times during this setup. This is standard behavior for email routing security.

If you encounter any issues or have additional questions, please reach out to **StackTome Support**.

<iframe width="640" height="364" src="https://www.loom.com/embed/8f97d1f1a92e4e7fb7c7c7219a6bfe9b" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>