# Email Template

For sending review invites via email an HTML template has to be defined. As templates could be reused across multiple campaigns we need to configure it separately from the campaign itself. Template is configured as:

Name - template name used in campaigns

Template HTML - used to set email body when sending invites

Template also will support placeholder variables using handle bar syntax, for example {{first_name}} which should be part of the template editor

# Accessing Email Templates

To access the Email Templates section, follow these steps:

* Navigate to the "Invitations" menu.
* Click on "Email Templates".

# Email Templates List Page

Upon accessing the Email Templates section, you will encounter a list of existing templates with the following details:

* Published: Indicates the status of the template with a green or red circle.
* Name: Displays the name of the template.
* Copy Icon Button: Allows you to create a new template based on the clicked template's details.
* Delete Icon Button: Enables you to delete the template. A confirmation modal will appear before deletion.

# Adding or Updating Email Templates

When adding a new template or updating an existing one, you'll encounter the Email Templates form page with the following options:

* Name: Enter the name of the template. For new templates, it defaults to "NEW - Email Template". For updates, it displays "UPDATE - {template name}".
Actions:
* ADD/SAVE Button: Saves the changes made to the template.
* PUBLISH Button: Publishes the template.
* SEND TEST EMAIL Button: Opens a modal form for sending a test email. Note that email variables will not be populated in this test.

# Template Content Configuration

In the Email Templates form page, you'll configure the content of the template with the following fields:

* Content: Toggle between "Visual" and "Code" modes for editing the template content.
* Email Template Content: Utilize the rich HTML email template editor to design the email content. Ensure it contains the following mandatory merge tags:
* {{review_invite_link}}: Redirects the recipient to leave a review on the relevant platform.
* {{unsubscribe_link}}: Redirects the recipient to unsubscribe from emails.

# Validation

Ensure that the email template contains the mandatory merge tags mentioned above for proper functionality.

# Conclusion

This user guide provides comprehensive instructions for managing email templates effectively. By following these steps, you can create, update, and publish templates tailored to your communication needs.

For further assistance or inquiries, please refer to the user manual or contact our support team. Thank you for choosing our platform for your email communication requirements!