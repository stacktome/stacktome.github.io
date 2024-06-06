# Template Definition

A template definition within the segment builder serves as an SQL criteria, akin to a 'where condition', allowing users to filter data based on specified parameters. These templates facilitate the creation of customizable segments by incorporating placeholder values that can be configured via the segment builder's user interface (UI). The primary aim is to establish concise templates that can be flexibly combined and reused across various segments.

To create a new template, follow these steps:

1. Define Field: Specify the field from the customer event table to filter on. This step is required.
Example: "count_purchase"

2. Add Placeholder Condition (Optional): Optionally, include a placeholder condition such as {condition:number/text/date}.

3. Add Placeholder for Value (Optional): Optionally, incorporate a placeholder for the value.

Note: Each template allows for a maximum of two placeholders to ensure ease of combination and simplification in the segments UI.

Every template should include a descriptive text that provides additional information to users. This description can be viewed on the segment edit page whenever more details are required.