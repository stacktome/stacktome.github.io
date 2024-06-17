# Template Picker

The Template Picker feature allows users to select different templates for segmentation. The basic structure of the Template Editor consists of two main parts: Template Row and Template List.

Template Row

* Template: A drop-down selector with search functionality, allowing users to pick one template from the global and account template list.
* Condition: If a template has a defined condition, users can select the condition value based on the condition type. This determines how the condition is translated into SQL and what value can be set. If the condition is not defined in the template, this column will be disabled.
* Value: The value selector depends on the condition type defined in the template. It could be:
* Number Picker for numeric conditions
* Text Input for text conditions
* Date Picker for conditions involving dates
* From/To Date Picker for conditions involving a date range
* Time Interval Picker for conditions involving a time interval, with options such as minutes, hours, days, months, years.

Template List

* The Template Picker allows users to add as many rows as needed, even multiple instances of the same template.
* Each new row has a logical conjunction (AND/OR).
* Templates can have negation, including all customers that don’t match the condition.
* Users can group template rows together either by indenting them to the right side or by selecting and marking rows that should be grouped.

Saving Templates

* Once templates are set and saved, they are sent as a unified structure for translation to SQL.
* Each template includes the actual template text, condition, and actual value set.