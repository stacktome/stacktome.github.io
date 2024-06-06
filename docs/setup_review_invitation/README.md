# Review Invites

Any ecommerce store that wants to get reviews has to have a review invitation process. This is mandatory before any review data can be collected. Review invites tend to work in 2 ways:

* By sending all orders data including customer information with email address to review platform which sends review invites to those customers

* By creating an email campaign on an ESP (email service provider) and trigger email sends to all new customers. Note customer information must also be present in ESP before email campaign can be triggered.

Both of these processes require implementation and support effort from a business to ensure the review processes is working. In addition if using review platform, there tends to be a limit on how many review invites can be sent and sending logic itself can be ambiguous (not configurable). Furthermore business is locked in to the review platform making it impossible to send review invites to other platforms (if collecting from more than 1 review provider). This leads to having to manage the review invite process themselves which involves having custom workflow configuration on ESP, sending order/customer data and managing scheduling of campaigns. Setting up and managing this logic usually requires a developer which not all e-commerce companies might want to dedicate.

Right now at StackTome we don’t have any way to send review invites, as assumption is made that potential businesses of using our solution would already have an invitation process in place. This isn’t the case if we are considering:

* e-commerce businesses that don’t have reviews yet

* b2b companies that don’t have consistent review invite process

* e-commerce companies that use 1 platform but would like to expand to more than 1 or migrate to another

Therefore having review invites could be helpful for both companies that have reviews and also those that don’t. Additional side benefit of having review invite process managed by StackTome is that the sales data that is received can be reused for customer segmentation enabling more features that businesses can use.