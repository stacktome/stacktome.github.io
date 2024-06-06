# Template Placeholders

This documentation provides information on placeholders used within templates for defining conditions.

# Condition Types

Templates support various types of conditions such as number, date, text, and value.

# Number Conditions

* is equal to: = {value}
* is not equal to: != {value}
* is more than: > {value}
* is less than: < {value}
* is greater than or equal to: >= {value}
* is less than or equal to: <= {value}
* is one of: IN ({values…})

# Date Conditions

* within: > {value: datetime_interval}
* before: < {value: date}
* on or before: <= {value: date}
* after: > {value: date}
* on or after: >= {value: date}
* between: between {from: date} AND {to: date}
* on the date: = {value: date}

# Text Conditions

* Is equal to: = {value}
* Is not equal to: != {value}
* Starts with: > like ‘{value}%’
* Contains: like ‘%{value}%’
* Is one of: IN (‘{values…}’)

# Value Conditions

* Number: {value: number}
* Date: {value: date}
* Date range: {from: date}, {to: date}
* Datetime interval: {value, type} - for example {2, hours} → (current_timestamp - interval 2 hours)
* Text: '{value: string}'
* Array of numbers: [{value1:number},{value2:number},{value3:number}]
* Array of text: [{value1:string},{value2:string},{value3:string}]

# Template Combination

To utilize multiple templates within a segment, they need to be joined using logical AND or OR operators. The structure of the template list will include joining keywords between segment pairs.

* Simple logical AND between 2 templates: ((t1, ‘AND’), t2)
* Logical combination of multiple templates: ((t1, ‘AND’), (t2, 'OR'), t3)
* Grouping templates: [((t1, ‘OR’), (t2, ‘OR'), t3)], 'AND’), t4)

# Group Structure

Groups are defined as lists where a tuple connects to other templates using join keywords.

# Negation

The negation of a template can be achieved by including the keyword 'NOT' in the tuple.

# Models

* Item: { negate: bool, template: Template, join: AND | OR | undefined}
* Group: items:[], join: AND | OR | undefined, next: Group