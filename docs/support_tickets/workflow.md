# Workflow

The publishing logic is designed to efficiently process reviews from various sources using the Stacktome API and publish them as tickets to a designated customer support API, based on predefined criteria.

# Steps to Implement Publishing Logic

* Scheduler Execution: The workflow begins with the Scheduler executing at regular intervals of 30 minutes. During each execution, it fetches all review source connections and their respective publish configurations.

* Message Generation: A single message is generated containing instructions to load, materialize, and publish reviews along with all publish configurations.

* Message Processing: The message is processed by the new-pipeline reports. This component collects reviews from various sources, materializes data, and processes each publishing message based on the timestamp interval and predefined criteria such as rating, sentiment score, and keywords. Empty reviews are skipped during this process.

* Ticket Creation: Reviews that match the specified criteria are sent to the designated customer support API. Currently, only Zendesk is supported as the target customer support API.

# Publishing Details

* Deduplication: To avoid duplicating tickets, the system filters only those reviews that fall within the timestamp interval specified in the message.

* Error Handling: If any review publishing fails, the message will be retried until it is successfully published.