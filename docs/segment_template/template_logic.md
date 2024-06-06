# Template Logic

Template logic allows users to define customizable blocks of segmentation logic in advance. These templates facilitate the segmentation of data based on predefined criteria. There are primarily three main criteria that users can utilize: WHO, WHAT, and WHEN.

# Criteria

1. WHO: This refers to the target audience or user group. For example, "customers with 1 purchase."

2. WHAT: This indicates the action or event that has occurred. For instance, "visited page X."

3. WHEN: This denotes the timeframe within which the action or event occurred. For example, "last 7 days."

Each criterion can also be used independently without custom values. For instance, "user has left a review," to which a time condition, such as "in the last 7 days," can be attached.

# Combination of Templates

Templates can be combined to create more complex segmentation conditions. For example, a customer who "made a purchase within the last 7 days" and "has left a review in the last 14 days."

# Negative Conditions

Template conditions can also be negated, allowing users to transform positive actions into negative ones. For instance, "not made a purchase in the last 7 days."

# Logical Operators

Users can use logical operators such as AND, OR to combine multiple templates or segments. This enables the creation of larger segments. The syntax for combining templates is as follows:
T1 {who, what, when} AND/OR NOT T2 {who, what, when}

# Grouping Templates

Users have the option to group different templates together for more complex conditions. For example:
(T1 OR T2) AND T3

This grouping allows for the creation of intricate segmentation logic tailored to specific needs.
