# Segments

Customer segmentation and export was a first product that we have implemented in the past.

The problem with this implementation that it has changed over the years and doesn’t represent the exactly the features we want to use it for.

Basic idea of segmentation is to allow business to market to specific customers (and potentially visitors later) via specific marketing channels (google ads, facebook, email, sms etc.). To do this we should provide a way for a user to define a segment with certain criteria, like all customers that bought > 1 time in the last 30 days. Then all customers that match the criteria are sent to selected marketing channels. On daily/hourly basis the list is changing adding or removing customers that match the criteria. The updates are then  send updates to target channels.