# Review Collection Service Specification

## Overview

This specification defines the API endpoints for a review collection service that allows customers to submit product reviews for specific orders. The service supports review submission, retrieval, and invitation generation with a security model that enables public submission via invitation tokens.

## Base Path

All endpoints are under: `/api/reviews/v1`

## Endpoints

### 1. Generate Invitation

**Endpoint:** `POST /private/invitations`

**Description:** Generates a unique invitation link token that can be used to submit a review. The invitation contains encoded information about the reviewer, order, and product.

**Authentication:** Open endpoint (no authentication required, but may be rate-limited)

**Request Body:**
```json
{
  "accountId": "string (required)",
  "orderId": "string (required)",
    "products": [
    {
        "productUrl": "string (required)",
        "imageUrl": "string (required)",
        "name": "string (required)",
        "sku": "string (required)",
        "skuBase": "string (optional)",
        "id": "string (optional)",
        "variationId": "string (optional)",
        "gtin": "string (optional)",
        "mpn": "string (optional)",
        "brand": "string (optional)",
    }
  "locale": "string (required)",
  "redirectUri": "string (optional)",
  "reviewerEmail": "string (required)",
  "reviewerName": "string (optional)",
  "expiresInDays": "integer (optional, default: 30)"
}
```

**Response:**
```json
{
  "invitationToken": "string",
  "invitationUrl": "string",
  "expiresAt": "string (ISO 8601 date-time)"
}
```

**Status Codes:**
- `201 Created` - Invitation generated successfully
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Order or product not found
- `429 Too Many Requests` - Rate limit exceeded

**Notes:**
- Invitation tokens are **short, opaque tokens** (e.g., UUID v4 or cryptographically secure random strings)
- Tokens are stored in the database with associated invitation data
- Token length should be kept short (16-32 characters) to avoid email link truncation
- Invitation URLs should be in format: `https://{domain}/review/{invitationToken}`
- Token validation requires database lookup to retrieve invitation data

---

### 2. Get Invitation Data

**Endpoint:** `GET /public/invitations/{token}`

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

**Endpoint:** `POST /public/reviews`

**Description:** Submits a new review for a product associated with a specific order using an invitation token.

**Authentication:** Open endpoint (requires valid invitation token)

**Request Body:**
- Must include `invitationToken` field (see request body below)

**Request Body:**
valid json compliant with iglu schema:

@review-iglu-schema.json

**Response:**
- as one order can have multiple products, should return a list of responses 
- for every review submitted
```json
[{
  "reviewId": "string",
  "status": "published",
  "createdAt": "string (ISO 8601 date-time)",
  "message": "Review submitted successfully"
}]
```

**Status Codes:**
- `201 Created` - Review submitted successfully
- `400 Bad Request` - Invalid request data or missing required fields
- `401 Unauthorized` - Invalid or expired invitation token
- `409 Conflict` - Review already exists for this order/product combination
- `422 Unprocessable Entity` - Validation failed (orderId or product SKU mismatch)
- `429 Too Many Requests` - Rate limit exceeded

**Business Rules:**
- Look up invitation data from database using token
- Validate token hasn't expired and hasn't been used
- Extract invitation data (accountId, orderId, products, reviewerEmail, etc.)
- Use extracted data to populate review fields
- Mark invitation as used (set `used_at` timestamp)
- Set initial status to "published"
- Store all review data according to the event schema
- **Note**: Review submission data in request body should match or complement data from invitation

**Validation Rules:**

The service enforces strict validation to ensure reviews match the invitation data:

1. **Order ID Validation**
   - If `orderId` is provided in the review submission, it **must match** the `orderId` in the invitation
   - If `orderId` is not provided, the invitation's `orderId` will be used
   - **Error**: Returns `422 Unprocessable Entity` with message indicating orderId mismatch

2. **Product SKU Validation**
   - The `product.sku` field is **required** for all product reviews
   - The provided SKU **must be present** in the invitation's `products` array
   - Multiple reviews can be submitted with different SKUs if the invitation includes multiple products
   - **Error**: Returns `422 Unprocessable Entity` with message indicating SKU not found in invitation

**Example Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Review 0: orderId 'ORD-WRONG' does not match invitation orderId 'ORD-12345'; Review 1: product SKU 'SKU-999' is not in the invitation's product list"
  }
}
```

**Acceptable Format for Multiple Product Reviews:**

When an invitation includes multiple products (e.g., SKU-123 and SKU-456), you can submit reviews for any or all products:

```json
[
  {
    "invitationToken": "abc123token",
    "orderId": "ORD-12345",
    "product": {"sku": "SKU-123", "name": "Product 1"},
    "rating": 5,
    "text": "Great product!"
  },
  {
    "invitationToken": "abc123token",
    "orderId": "ORD-12345",
    "product": {"sku": "SKU-456", "name": "Product 2"},
    "rating": 4,
    "text": "Good product too!"
  }
]
```

**Important Notes:**
- All reviews in a single submission must use the **same invitation token**
- All reviews must have SKUs that are listed in the invitation's products
- Submitting a review for a SKU not in the invitation will be rejected
- After successful submission, the invitation token is marked as used and cannot be reused

---

### 5. Get Review by ID

**Endpoint:** `GET /v1/public/reviews/single/{reviewId}`

**Description:** Retrieves a review by its unique identifier. Can be accessed via invitation link or publicly if the review is published.

**Authentication:** Open endpoint (no authentication required)

**Request Parameters:**
- `reviewId` (path parameter, required): The unique review identifier
- `invitationToken` (query parameter, optional): Invitation token for accessing unpublished reviews

**Response:**
```json
{
  "reviewId": "string",
  "orderId": "string (optional)",
  "product": {
    "sku": "string",
    "name": "string (optional)",
    "url": "string (optional)",
    "imageUrl": "string (optional)",
    "brand": "string (optional)",
    "category": "string (optional)"
  },
  "customer": {
    "email": "string (optional, only if accessed via invitation token)",
    "name": "string (optional, only if accessed via invitation token)",
    "customerId": "string (optional)"
  },
  "rating": "integer (1-5)",
  "title": "string (optional)",
  "reviewText": "string (optional)",
  "images": ["string (optional)"],
  "videos": ["string (optional)"],
  "attributes": "object (optional)",
  "verifiedPurchase": "boolean",
  "incentivized": "boolean",
  "status": "string",
  "published": "boolean",
  "publishedAt": "string (ISO 8601 date-time, optional)",
  "helpfulCount": "integer",
  "notHelpfulCount": "integer",
  "metrics": {
    "sentimentScore": "number (optional)",
    "wordCount": "integer (optional)",
    "languageCode": "string (optional)",
    "tags": ["string (optional)"]
  },
  "createdAt": "string (ISO 8601 date-time)",
  "updatedAt": "string (ISO 8601 date-time)"
}
```

**Status Codes:**
- `200 OK` - Review retrieved successfully
- `401 Unauthorized` - Invalid invitation token for unpublished review
- `403 Forbidden` - Review exists but is not accessible (e.g., rejected, archived)
- `404 Not Found` - Review not found

**Business Rules:**
- Published reviews (`published: true`) can be viewed by anyone
- Unpublished reviews (`published: false`) require a valid invitation token to access
- PII (email, name) is only returned when accessed via invitation token
- Returns 401 Unauthorized if attempting to access unpublished review without valid invitation token

---

### 5a. Get Reviews by Token

**Endpoint:** `GET /v1/public/reviews/token/{token}`

**Description:** Retrieves all reviews submitted via a specific invitation token. Returns the complete list of reviews without pagination.

**Authentication:** Open endpoint (no authentication required)

**Request Parameters:**
- `token` (path parameter, required): The invitation token

**Response:**
```json
{
  "reviews": [
    {
      "reviewId": "string",
      "orderId": "string (optional)",
      "product": {
        "sku": "string",
        "name": "string (optional)",
        "url": "string (optional)",
        "imageUrl": "string (optional)",
        "brand": "string (optional)",
        "category": "string (optional)"
      },
      "customer": {
        "email": "string (optional)",
        "name": "string (optional)",
        "customerId": "string (optional)"
      },
      "rating": "integer (1-5)",
      "title": "string (optional)",
      "reviewText": "string (optional)",
      "images": ["string (optional)"],
      "videos": ["string (optional)"],
      "attributes": "object (optional)",
      "verifiedPurchase": "boolean",
      "incentivized": "boolean",
      "status": "string",
      "published": "boolean",
      "publishedAt": "string (ISO 8601 date-time, optional)",
      "helpfulCount": "integer",
      "notHelpfulCount": "integer",
      "metrics": {
        "sentimentScore": "number (optional)",
        "wordCount": "integer (optional)",
        "languageCode": "string (optional)",
        "tags": ["string (optional)"]
      },
      "createdAt": "string (ISO 8601 date-time)",
      "updatedAt": "string (ISO 8601 date-time)"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Reviews retrieved successfully (may be empty if no reviews submitted)
- `401 Unauthorized` - Invitation token has expired
- `404 Not Found` - Invalid invitation token
- `400 Bad Request` - Request processing failed

**Business Rules:**
- Validate invitation token exists in database
- Return all reviews associated with the token, sorted by creation date (newest first)
- Return full PII since access is controlled by token possession
- No pagination: returns complete result set
- Token must not be expired (`expires_at > NOW()`)

---

<!--
### 6. Update Review - DEFERRED TO FUTURE PHASE

**Endpoint:** `PUT public/reviews/{reviewId}`

**Description:** Updates an existing review. Only the original author can update their review, which requires email-based authentication.

This endpoint is deferred to a future phase and not currently implemented.

---

### 7. Request Email Authentication Token - DEFERRED TO FUTURE PHASE

**Endpoint:** `POST /public/reviews/{reviewId}/auth/request`

**Description:** Initiates the email authentication flow for updating a review. Sends a one-time code to the reviewer's email.

This endpoint is deferred to a future phase and not currently implemented.

---

### 8. Verify Email Authentication Code - DEFERRED TO FUTURE PHASE

**Endpoint:** `POST /public/reviews/{reviewId}/auth/verify`

**Description:** Verifies the one-time code sent via email and returns an authentication token for updating the review.

This endpoint is deferred to a future phase and not currently implemented.
-->

---

### 9. Get Reviews for Data Pipeline

**Endpoint:** `POST /v1/private/reviews`

**Description:** Retrieves reviews with date filtering for data pipeline integration. This endpoint is designed for internal use by data pipelines to fetch reviews within specific time ranges for analysis, reporting, and ETL processes.

**Authentication:** Requires internal service authentication (API key or JWT token for service-to-service communication)

**Request Headers:**
- `Authorization`: Bearer token or API key for internal service authentication

**Request Body:**
```json
{
  "startDate": "string (optional, ISO 8601 date-time)",
  "endDate": "string (optional, ISO 8601 date-time)",
  "status": "string (optional)",
  "published": "boolean (optional)",
  "limit": "integer (optional, default: 50, max: 100)",
  "offset": "integer (optional, default: 0)"
}
```

**Response:**
```json
{
  "reviews": [
    {
      "reviewId": "string",
      "orderId": "string (optional)",
      "product": {
        "sku": "string",
        "name": "string (optional)",
        "url": "string (optional)",
        "imageUrl": "string (optional)",
        "brand": "string (optional)",
        "category": "string (optional)"
      },
      "customer": {
        "email": "string (optional)",
        "name": "string (optional)",
        "customerId": "string (optional)"
      },
      "rating": "integer (1-5)",
      "title": "string (optional)",
      "reviewText": "string (optional)",
      "images": ["string (optional)"],
      "videos": ["string (optional)"],
      "attributes": "object (optional)",
      "verifiedPurchase": "boolean",
      "incentivized": "boolean",
      "status": "string",
      "published": "boolean",
      "publishedAt": "string (ISO 8601 date-time, optional)",
      "helpfulCount": "integer",
      "notHelpfulCount": "integer",
      "metrics": {
        "sentimentScore": "number (optional)",
        "wordCount": "integer (optional)",
        "languageCode": "string (optional)",
        "tags": ["string (optional)"]
      },
      "createdAt": "string (ISO 8601 date-time)",
      "updatedAt": "string (ISO 8601 date-time)"
    }
  ],
  "total": "integer",
  "limit": "integer",
  "offset": "integer"
}
```

**Status Codes:**
- `200 OK` - Reviews retrieved successfully
- `400 Bad Request` - Invalid request parameters (e.g., invalid date format, limit exceeds max)
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - Service does not have permission to access this endpoint

**Business Rules:**
- Requires valid service authentication (internal API key or JWT)
- Returns complete review data including PII (unlike public endpoints)
- Date filters are optional; if not provided, returns most recent reviews
- Maximum limit per request is 100 to prevent performance issues
- Use `startDate` and `endDate` for filtering reviews by creation date range
- Results are paginated; use `offset` and `limit` for pagination

**Use Cases:**
- **Incremental ETL**: Fetch reviews created within specific date ranges
- **Analytics**: Extract review data for analysis and reporting
- **Data Warehouse Sync**: Synchronize review data to data warehouse
- **Audit Logging**: Track review creation patterns
- **Quality Monitoring**: Monitor review sentiment and quality over time

**Example Requests:**

Fetch reviews created in a date range:
```json
POST /v1/private/reviews
{
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "limit": 50,
  "offset": 0
}
```

Fetch published reviews only:
```json
POST /v1/private/reviews
{
  "published": true,
  "status": "published",
  "limit": 100
}
```

---

## Security Model

### Public Submission (Open Endpoints)

The following endpoints are open (no authentication required) but have restrictions:

1. **POST /private/invitations** - Rate limited, may require CAPTCHA for high-volume requests
2. **GET /public/invitations/{token}** - Returns invitation data by token
3. **POST /public/reviews** - Requires valid invitation token
4. **GET /v1/public/reviews/single/{reviewId}** - Public for published reviews, requires invitation token for unpublished
5. **GET /v1/public/reviews/token/{token}** - Returns all reviews for a specific invitation token

### Private (Authenticated) Endpoints

The following endpoints require service authentication:

1. **POST /v1/private/reviews** - Data pipeline endpoint for fetching reviews with filtering (requires API key or service JWT)

### Invitation Token Security

Invitation tokens are **short, opaque tokens** stored in the database with associated invitation data. This approach:
- **Short URLs**: Tokens are 16-32 characters, keeping email links compact
- **Email-friendly**: Avoids link truncation by email providers
- **Secure**: Cryptographically secure random generation (e.g., UUID v4, SecureRandom)
- **Trackable**: Database storage enables analytics and usage tracking
- **Expirable**: Expiration tracked in database

#### Token Generation

When `POST /invitations` is called:
1. Validate request data (accountId, orderId, products, etc.)
2. Generate cryptographically secure random token (16-32 characters)
   - Options: UUID v4, base64url-encoded random bytes, or similar
   - Example: `a3f9k2m8p1q7r4t6` or `xK9mP2qR7vN4wT8`
3. Calculate expiration: `expires_at = NOW() + expiresInDays` (default: 30 days)
4. Store invitation data in database with token
5. Return token in response

**Example token generation (pseudo-code):**
```scala
// Generate short, secure token
val token = UUID.randomUUID().toString.replace("-", "").substring(0, 24)
// Or using SecureRandom for more control:
val bytes = new Array[Byte](16)
SecureRandom.getInstanceStrong.nextBytes(bytes)
val token = Base64.getUrlEncoder.withoutPadding().encodeToString(bytes)

// Store in database
val invitation = ReviewInvitation(
  invitationToken = token,
  accountId = request.accountId,
  orderId = request.orderId,
  products = request.products, // Store as JSONB
  locale = request.locale,
  redirectUri = request.redirectUri,
  reviewerEmail = request.reviewerEmail,
  reviewerName = request.reviewerName,
  expiresAt = now.plusDays(expiresInDays)
)
```

#### Token Validation

When `POST /reviews` is called with invitation token:
1. Use token from POST request
2. Look up invitation record in database by token
3. Validate token exists and hasn't expired (`expires_at > NOW()`)
4. Validate token hasn't been used (`used_at IS NULL`)
5. Extract invitation data from database record
6. Use extracted data to populate review submission
7. Mark invitation as used (set `used_at = NOW()`)

**Benefits:**
- **Short URLs**: Tokens are compact, email-friendly
- **No link truncation**: Works with all email providers
- **Trackable**: Can track invitation usage and conversion rates
- **Revocable**: Can invalidate tokens by updating database
- **Analytics**: Can query invitation metrics from database

#### Security Best Practices

1. **Token Generation**: Use cryptographically secure random generation (SecureRandom, UUID v4)
2. **Token Length**: 16-32 characters is sufficient for security while keeping URLs short
3. **Expiration**: Default 30 days, but configurable per invitation
4. **Token Uniqueness**: Ensure tokens are unique (database constraint)
5. **HTTPS Only**: Always use HTTPS when transmitting tokens in URLs
6. **Database Indexing**: Index `invitation_token` for fast lookups
7. **Token Cleanup**: Periodically clean up expired/unused tokens (optional)

<!--
### Email Authentication Flow - DEFERRED TO FUTURE PHASE

Email-based authentication for review updates is deferred to a future phase.
-->

### Kong Integration (Future Phase)

**Note:** For the first phase, Kong integration is not required. All token validation will be handled by the review-service directly.

**Future enhancements (Phase 2+):**
- Rate limiting on open endpoints
- Request routing and load balancing
- Optional: JWT validation for email auth tokens (if using JWT for email auth)
- CAPTCHA integration for invitation generation

---

## Database Schema

### Storage: PostgreSQL

The service uses PostgreSQL for persistent storage. The schema is designed to accommodate the event schema while maintaining simplicity.

### Table: `review_collections`

```sql
CREATE TABLE review_collections (
    review_id VARCHAR(255) PRIMARY KEY,
    account_id VARCHAR(255) NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    product_sku VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    invitation_token VARCHAR(255), -- Foreign key to review_invitations

    -- Review content
    review_type VARCHAR(50) NOT NULL CHECK (review_type IN ('product', 'service')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    heading TEXT,
    text TEXT,
    language VARCHAR(10),
    domain VARCHAR(255),

    -- Media
    images JSONB, -- Array of image URLs
    videos JSONB, -- Array of video URLs

    -- Attributes (flexible JSON structure)
    attributes JSONB, -- Array of attribute objects

    -- Status and moderation
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'published', 'rejected', 'archived', 'disputed')),
    moderation_log JSONB, -- Array of moderation actions

    -- Verification and compliance
    is_verified BOOLEAN DEFAULT FALSE,
    is_incentivized BOOLEAN DEFAULT FALSE,
    consent_stored BOOLEAN NOT NULL DEFAULT FALSE,

    -- Product data (denormalized for performance)
    product_data JSONB, -- Full product object

    -- Customer data (PII - handle carefully)
    customer_data JSONB, -- Full customer object

    -- Conversation/thread
    conversation JSONB, -- Array of conversation messages

    -- Metrics
    metrics JSONB DEFAULT '{"helpfulVotes": 0, "unhelpfulVotes": 0, "viewCount": 0}'::jsonb,

    -- Sentiment and analysis
    sentiment_score DECIMAL(5, 2),

    -- Links
    link VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_order_product_review UNIQUE (order_id, product_sku, reviewer_email),

    -- Foreign key to review_invitations
    CONSTRAINT fk_invitation_token FOREIGN KEY (invitation_token)
        REFERENCES review_invitations(invitation_token) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_review_collections_account_id ON review_collections(account_id);
CREATE INDEX idx_review_collections_order_id ON review_collections(order_id);
CREATE INDEX idx_review_collections_product_sku ON review_collections(product_sku);
CREATE INDEX idx_review_collections_status ON review_collections(status);
CREATE INDEX idx_review_collections_reviewer_email ON review_collections(reviewer_email);
CREATE INDEX idx_review_collections_created_at ON review_collections(created_at);
CREATE INDEX idx_review_collections_updated_at ON review_collections(updated_at);
CREATE INDEX idx_review_collections_account_status ON review_collections(account_id, status);
CREATE INDEX idx_review_collections_invitation_token ON review_collections(invitation_token);

-- GIN indexes for JSONB fields for efficient querying
CREATE INDEX idx_review_collections_product_data_gin ON review_collections USING GIN (product_data);
CREATE INDEX idx_review_collections_attributes_gin ON review_collections USING GIN (attributes);
```

### Table: `review_invitations`

**Required table** for storing invitation data. Invitation tokens are short, opaque tokens that reference this table.

```sql
CREATE TABLE review_invitations (
    invitation_token VARCHAR(255) PRIMARY KEY, -- Short opaque token (16-32 chars)
    account_id VARCHAR(255) NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    
    -- Products data (stored as JSONB for flexibility)
    products JSONB NOT NULL, -- Array of product objects
    
    -- Reviewer information
    reviewer_email VARCHAR(255) NOT NULL,
    reviewer_name VARCHAR(255),
    
    -- Invitation metadata
    locale VARCHAR(10) NOT NULL,
    redirect_uri VARCHAR(500),
    
    -- Token metadata
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
);

-- Indexes
CREATE INDEX idx_review_invitations_account_id ON review_invitations(account_id);
CREATE INDEX idx_review_invitations_order_id ON review_invitations(order_id);
CREATE INDEX idx_review_invitations_reviewer_email ON review_invitations(reviewer_email);
CREATE INDEX idx_review_invitations_expires_at ON review_invitations(expires_at);
CREATE INDEX idx_review_invitations_review_id ON review_invitations(review_id);
CREATE INDEX idx_review_invitations_used_at ON review_invitations(used_at) WHERE used_at IS NULL;

-- GIN index for JSONB products field (for querying product data)
CREATE INDEX idx_review_invitations_products_gin ON review_invitations USING GIN (products);
```

**Usage Pattern:**
- When generating invitation: Store all invitation data with generated token
- When submitting review: Look up invitation by token, validate expiration and usage, mark as used
- Token validation: Always validate via database lookup (token → invitation data)

<!--
### Tables: `review_auth_codes` and `review_auth_tokens` - DEFERRED TO FUTURE PHASE

These tables support email-based authentication for review updates, which is deferred to a future phase.
-->

---

<!--
## Caching Strategy - DEFERRED TO FUTURE PHASE

Caching implementation is deferred to a future phase.
-->

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": {
    "code": "string (error code)",
    "message": "string (human-readable message)",
    "details": "object (optional, additional error details)"
  }
}
```

### Common Error Codes

- `INVALID_REQUEST` - Invalid request parameters
- `INVALID_TOKEN` - Invalid or expired token
- `TOKEN_EXPIRED` - Invitation token has expired
- `TOKEN_USED` - Invitation token has already been used
- `VALIDATION_FAILED` - Review data validation failed (orderId or SKU mismatch with invitation)
- `UNAUTHORIZED` - Authentication required or failed
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., duplicate review)
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

### Recommended Limits

- **POST /private/invitations**: 10 requests per IP per hour
- **GET /public/invitations/{token}**: 100 requests per token per hour
- **POST /public/reviews**: Invitation token is single-use
- **GET /v1/public/reviews/single/{reviewId}**: 100 requests per IP per minute
- **GET /v1/public/reviews/token/{token}**: 50 requests per token per hour
- **POST /v1/private/reviews**: 1000 requests per service per hour (internal use only)

---

## Data Privacy and Compliance

### GDPR/CCPA Compliance

- `consentStored` field must be set to `true` when review is submitted
- PII (email, full name) should only be returned:
  - To the original author via invitation token
  - To authenticated original author
  - Not in public API responses for published reviews
- Customer `displayName` should be used for public-facing reviews (e.g., "John D." instead of full name)

### Data Retention

- Reviews should be retained according to account's data retention policy
- Invitation tokens should be cleaned up after expiration (suggested: 90 days)

---

## Future Considerations

### Potential Enhancements

1. **Bulk Operations**: Endpoints for submitting multiple reviews at once
2. **Review Moderation**: Admin endpoints for moderating reviews (approve/reject/flag)
3. **Review Replies**: Endpoints for adding conversation/replies to reviews
4. **Review Analytics**: Endpoints for retrieving review metrics and statistics
5. **Webhook Support**: Notifications when reviews are submitted/updated
6. **Image/Video Upload**: Direct upload endpoints instead of requiring pre-uploaded URLs
7. **Review Templates**: Support for structured review forms with custom attributes
8. **Multi-language Support**: Enhanced language detection and translation

---

## Implementation Notes

1. **Review ID Generation**: Use UUID v4 or similar to ensure global uniqueness
2. **Token Generation**: Use cryptographically secure random generation (e.g., `SecureRandom` in Java/Scala)
3. **Email Sending**: Integrate with existing email service for sending one-time codes
4. **Image/Video URLs**: Validate that provided URLs are accessible and in allowed domains
5. **Transaction Management**: Use database transactions for review creation to ensure data consistency
6. **Async Processing**: Consider async processing for:
   - Email sending (future phase)
   - Sentiment analysis (future phase)
   - Image/video validation (future phase)
