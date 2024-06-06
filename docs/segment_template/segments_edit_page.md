# Segments Edit Page

Buttons:

* SAVE: Clicking this button will either create a new segment or update an existing one with the provided information.

* COUNT: Clicking this button will send a message to calculate the size of the segment. The count will be displayed as a notification.

* SYNC NOW: This button will be enabled only if the segment is created. Clicking it will send a message to update the segment in all channels.

Contains 2 tabs:

Segments Tab:

* Name: This field should be unique among all segments for service validation. It is required and cannot be empty.

* Status: This is a toggle for setting the segment as active or inactive, similar to publishing. By default, segments are set to active.

* Events: This is a multi-item dropdown selector, similar to ticket sources. Choices include: Purchase, Clickstream, Review, and Preference. At least one option must be selected.

* Targets: This is a multi-item dropdown selector, similar to ticket sources. Choices include: Google Ads, Facebook, Mailchimp, and Dotmailer. Each option displays both the name and icon. At least one option must be selected.

* Type: This is a radio button toggle selector between SQL and Template. SQL is the default selection.

* SQL (if type selected as SQL): This is a text area for editing SQL text. It is required for SQL type segments.

* Template

Schedule Tab