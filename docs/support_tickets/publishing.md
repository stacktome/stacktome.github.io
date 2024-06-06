# Publishing

# Publishing Process Details

* Review Querying: When the publish message executes, reviews are queried and filtered based on message criteria (timestamp, keywords, ratings, sentiment).
* Event Collection: All events already published for the given timestamp period (in days) are collected.
* Duplicate Filtering: Reviews already published are filtered out to avoid duplication caused by updates to the same review.
* Ticket Generation: Tickets are generated by applying templates to each review.
* Ticket Posting: Reviews are posted as tickets to the Customer Support API.

# Published Event Format Details
The "PublishEvent" format provides detailed information about each review that has been successfully published. Below is a breakdown of each field within the event:

1. reviewId:
* Description: The unique identifier of the review.
* Example: "215421sd54sd"

2. reviewTimestamp:
* Description: The timestamp indicating when the review was published.
* Example: "2020-04-20 10:15:11"

3. publishText:
* Description: The text content of the review.
* Example: "john@mail.com review needs reply from feefo http://feefo.com/company/review/215421sd54sd with rating: 1 text: didn't like service"

4. source:
* Description: The source or platform from which the review originated (e.g., Feefo, Trustpilot).
* Example: "feefo"

5. ratings:
* Description: The rating or score associated with the review.
* Example: [1, 2, 3]

6. fromSentimentScore:
* Description: The lower bound of the sentiment score range for the review.
* Example: -1

7. toSentimentScore:
* Description: The upper bound of the sentiment score range for the review.
* Example: 0

8. keywords:
* Description: Keywords associated with the review.
* Example: ["bad", "unsatisfied"]

9. configId:
* Description: The ID of the review publish configuration used for publishing the review.
* Example: 20

10. templateId:
* Description: The ID of the template used for generating the review ticket.
* Example: 1

11. template:
* Description: The template string used for generating the review ticket, including placeholders for variables.
* Example: "{customer_email} review needs reply from {review_source} {review_link} with rating: {review_rating} text: {review_text}[100]"

12. fromTimestamp:
* Description: The start timestamp of the time interval for which the review was considered.
* Example: "2020-04-20 10:00:00"

13. toTimestamp:
* Description: The end timestamp of the time interval for which the review was considered.
* Example: "2020-04-20 10:30:00"

14. eventTimestamp:
* Description: The timestamp indicating when the publishing event occurred.
* Example: "2020-04-20 10:31:11"

This detailed event format provides comprehensive information about each published review, facilitating tracking, analysis, and management of published reviews.