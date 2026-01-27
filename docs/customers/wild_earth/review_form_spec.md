# Review Submit form

I want to create a form, that would allow customers of StackTome clients to submit product reviews.

## Client Flow:
1. User clicks invitation link: https://{domain}/review/{token}
2. Client extracts token from URL
3. Client calls GET /invitations/{token} to get invitation data
4. Client renders review form with product/reviewer data
5. User submits review via POST /reviews with token
6. Client shows thank you page with review submition confirmation 
- later this will change to actual review edit form, where user with his email can make edits to the review.

From UX perspective requirements for a form:
- Should be able to submit multiple product reviews
- Upload images or videos for product review. Limit 3 media items (videos or images) per product review. files limited to 20MB per file.
- Should work on mobile, and able to leverage media selection compatible on mobile, possible even take a picture action
- if on mobile device could also make record button to convert text to review on the fly if relatively easy to add
- Should allow to select additional stars for quality and value as default, but potentially later will be configurable with the invite link

See @docs/customers/wild_earth/pre-star-select-form.png and @docs/customers/wild_earth/post-star-select-form.png for form mockups based on Trustpilot, star styles should be different but overall flow can be the same for first version.

# Spec for review service endpoints:

You can assume service prefix for staging:
 https://services-staging.stacktome.com/api/reviews/v1 
 - for prod:
 https://services.stacktome.com/api/reviews/v1 

### 2. Get Invitation Data

**Endpoint:** `GET /invitations/{token}`

**Description:** Retrieves invitation data by token. Used by the client to render the review form with pre-populated product and reviewer information.

**Authentication:** Open endpoint (no authentication required)

**Request Parameters:**
- `token` (path parameter, required): The invitation token from the URL

**Response:**
```json
{
  "invitationToken": "string",
  "accountId": "string",
  "orderId": "string",
  "products": [
    {
      "productUrl": "string",
      "imageUrl": "string",
      "name": "string",
      "sku": "string",
      "skuBase": "string (optional)",
      "id": "string (optional)",
      "variationId": "string (optional)",
      "gtin": "string (optional)",
      "mpn": "string (optional)",
      "brand": "string (optional)"
    }
  ],
  "locale": "string",
  "redirectUri": "string (optional)",
  "reviewerEmail": "string",
  "reviewerName": "string (optional)",
  "expiresAt": "string (ISO 8601 date-time)",
  "isUsed": "boolean",
  "isExpired": "boolean"
}
```

**Status Codes:**
- `200 OK` - Invitation data retrieved successfully
- `401 Unauthorized` - Invalid or expired invitation token
- `404 Not Found` - Invitation token not found
- `410 Gone` - Invitation has been used (review already submitted)

**Business Rules:**
- Look up invitation record in database by token
- If token not found, return `404 Not Found`
- If token has expired (`expires_at < NOW()`), return `401 Unauthorized` with `isExpired: true`
- If token has been used (`used_at IS NOT NULL`), return `410 Gone` with `isUsed: true`
- Return all invitation data for client to render form
- **Do NOT mark invitation as used** - that happens when review is submitted
- Client can use this data to pre-populate the review form

**Notes:**
- This endpoint is idempotent - can be called multiple times without side effects
- Client should call this when the review page loads to get form data
- If `isUsed: true`, client should show message that review was already submitted
- If `isExpired: true`, client should show expiration message

---

### 3. Submit Review

**Endpoint:** `POST /reviews`

**Description:** Submits a new review for a product associated with a specific order. Can be called via invitation link (no auth) or with authentication.

**Authentication:** Open endpoint when accessed via invitation token, otherwise may require authentication

**Request Headers:**
- `X-Invitation-Token` (optional): Invitation token from the invitation link
- `Authorization` (optional): Bearer token if authenticated (for authenticated users)

**Request Parameters:**
- `token` (query parameter, optional): Invitation token (alternative to header)

**Request Body:**
valid json compliant with iglue schema:

@review-iglu-schema.json

**Response:**
```json
{
  "reviewId": "string",
  "status": "pending",
  "createdAt": "string (ISO 8601 date-time)",
  "message": "Review submitted successfully"
}
```

**Status Codes:**
- `201 Created` - Review submitted successfully
- `400 Bad Request` - Invalid request data or missing required fields
- `401 Unauthorized` - Invalid or expired invitation token
- `409 Conflict` - Review already exists for this order/product combination
- `429 Too Many Requests` - Rate limit exceeded

**Business Rules:**
- If invitation token is provided:
  - Look up invitation data from database using token
  - Validate token hasn't expired and hasn't been used
  - Extract invitation data (accountId, orderId, products, reviewerEmail, etc.)
  - Use extracted data to populate review fields
  - Validate that the order exists and contains the specified products
  - Mark invitation as used (set `used_at` timestamp)
- If invitation token is missing and user is authenticated, use authenticated user's information
- Set initial status to "pending" for moderation
- Store all review data according to the event schema
- Update cache for the accountId after successful creation
- **Note**: Review submission data in request body should match or complement data from invitation