# API Documentation

## Base URL

```
http://localhost:4000
```

## Overview

This API provides endpoints for managing feedback submissions in the Feedback System application. All endpoints return JSON responses.

---

## Endpoints

### 1. Health Check

Check if the server is running and healthy.

**Endpoint:** `GET /health`

**Description:** Returns the health status of the API server.

**Request:**

- **Method:** `GET`
- **URL:** `http://localhost:4000/health`
- **Headers:** None required
- **Body:** None

**Response:**

- **Status Code:** `200 OK`
- **Response Body:**

```json
{
  "ok": true
}
```

**Example using cURL:**

```bash
curl -X GET http://localhost:4000/health
```

**Example using Postman:**

1. Method: `GET`
2. URL: `http://localhost:4000/health`
3. Click "Send"

---

### 2. Create Feedback

Submit a new feedback entry.

**Endpoint:** `POST /feedback`

**Description:** Creates a new feedback submission with user details and feedback content.

**Request:**

- **Method:** `POST`
- **URL:** `http://localhost:4000/feedback`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:**

```json
{
  "name": "Rohit Gurung",
  "email": "Rohitgrg@example.com",
  "phone": "9876543210",
  "rating": 5,
  "feedback": "Great experience! The service was excellent and the interface is user-friendly."
}
```

**Request Body Fields:**
| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `name` | string | Yes | User's full name | Must be a non-empty string |
| `email` | string | Yes | User's email address | Must be a valid email format |
| `phone` | string | Yes | User's phone number | Must be a non-empty string |
| `rating` | number | Yes | Rating from 1 to 5 | Must be between 1 and 5 (inclusive) |
| `feedback` | string | Yes | Feedback message | Must be a non-empty string |

**Success Response:**

- **Status Code:** `201 Created`
- **Response Body:**

```json
{
  "data": {
    "_id": "6731f8b0f1a2b3c4d5e6f7g8",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "rating": 5,
    "feedback": "Great experience! The service was excellent and the interface is user-friendly.",
    "createdAt": "2025-01-11T10:30:00.000Z",
    "updatedAt": "2025-01-11T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**

**400 Bad Request** - Missing required fields:

```json
{
  "message": "All fields are required"
}
```

**500 Internal Server Error** - Server error:

```json
{
  "message": "Internal server error"
}
```

**Example using cURL:**

```bash
curl -X POST http://localhost:4000/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "rating": 5,
    "feedback": "Great experience! The service was excellent."
  }'
```

**Example using Postman:**

1. Method: `POST`
2. URL: `http://localhost:4000/feedback`
3. Headers: Add `Content-Type: application/json`
4. Body: Select "raw" → "JSON"
5. Paste the JSON body example above
6. Click "Send"

---

### 3. Get All Feedback

Retrieve feedback submissions with pagination and sorting options.

**Endpoint:** `GET /feedback`

**Description:** Returns a paginated list of all feedback submissions. Supports sorting by creation date (newest or oldest first).

**Request:**

- **Method:** `GET`
- **URL:** `http://localhost:4000/feedback`
- **Headers:** None required
- **Query Parameters:**
  | Parameter | Type | Required | Default | Description | Constraints |
  |-----------|------|----------|---------|-------------|-------------|
  | `page` | number | No | `0` | Page number (0-indexed) | Must be >= 0 |
  | `limit` | number | No | `10` | Number of items per page | Must be between 1 and 100 |
  | `sort` | string | No | `desc` | Sort order by creation date | Must be `asc` or `desc` |

**Query Parameter Examples:**

- `?page=0&limit=10&sort=desc` - First page, 10 items, newest first (default)
- `?page=0&limit=10&sort=asc` - First page, 10 items, oldest first
- `?page=1&limit=25&sort=desc` - Second page, 25 items per page, newest first
- `?page=0&limit=100&sort=desc` - First page, maximum 100 items, newest first

**Success Response:**

- **Status Code:** `200 OK`
- **Response Body:**

```json
{
  "data": [
    {
      "_id": "6731f8b0f1a2b3c4d5e6f7g8",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "rating": 5,
      "feedback": "Great experience! The service was excellent.",
      "createdAt": "2025-01-11T10:30:00.000Z",
      "updatedAt": "2025-01-11T10:30:00.000Z"
    },
    {
      "_id": "6731f8b0f1a2b3c4d5e6f7g9",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "9876543211",
      "rating": 4,
      "feedback": "Good service, but could be improved.",
      "createdAt": "2025-01-11T09:15:00.000Z",
      "updatedAt": "2025-01-11T09:15:00.000Z"
    }
  ],
  "total": 2,
  "page": 0,
  "limit": 10,
  "sort": "desc"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `data` | array | Array of feedback objects |
| `total` | number | Total number of feedback entries in database |
| `page` | number | Current page number (0-indexed) |
| `limit` | number | Number of items per page |
| `sort` | string | Sort order applied (`asc` or `desc`) |

**Feedback Object Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | Unique identifier (MongoDB ObjectId) |
| `name` | string | User's full name |
| `email` | string | User's email address |
| `phone` | string | User's phone number |
| `rating` | number | Rating from 1 to 5 |
| `feedback` | string | Feedback message |
| `createdAt` | string | ISO 8601 timestamp of creation |
| `updatedAt` | string | ISO 8601 timestamp of last update |

**Error Responses:**

**500 Internal Server Error** - Server error:

```json
{
  "message": "Internal server error"
}
```

**Example using cURL:**

**Get all feedback (default - newest first):**

```bash
curl -X GET http://localhost:4000/feedback
```

**Get feedback with pagination:**

```bash
curl -X GET "http://localhost:4000/feedback?page=0&limit=10&sort=desc"
```

**Get feedback (oldest first):**

```bash
curl -X GET "http://localhost:4000/feedback?page=0&limit=10&sort=asc"
```

**Get feedback (page 2, 25 items per page):**

```bash
curl -X GET "http://localhost:4000/feedback?page=2&limit=25&sort=desc"
```

**Example using Postman:**

1. **Basic Request (Default):**

   - Method: `GET`
   - URL: `http://localhost:4000/feedback`
   - Click "Send"

2. **With Query Parameters:**
   - Method: `GET`
   - URL: `http://localhost:4000/feedback`
   - Go to "Params" tab
   - Add parameters:
     - Key: `page`, Value: `0`
     - Key: `limit`, Value: `10`
     - Key: `sort`, Value: `desc`
   - Click "Send"

---

## Complete API Endpoint List

### Quick Reference

| Method | Endpoint    | Description                        |
| ------ | ----------- | ---------------------------------- |
| `GET`  | `/health`   | Health check                       |
| `POST` | `/feedback` | Create new feedback                |
| `GET`  | `/feedback` | Get all feedback (with pagination) |

### All Available URLs

```
GET  http://localhost:4000/health
POST http://localhost:4000/feedback
GET  http://localhost:4000/feedback
GET  http://localhost:4000/feedback?page=0&limit=10&sort=desc
GET  http://localhost:4000/feedback?page=0&limit=10&sort=asc
GET  http://localhost:4000/feedback?page=1&limit=25&sort=desc
GET  http://localhost:4000/feedback?page=2&limit=50&sort=desc
GET  http://localhost:4000/feedback?page=0&limit=100&sort=desc
```

---

## Postman Collection Setup

### Creating a Postman Collection

1. **Open Postman** and create a new collection named "Feedback API"

2. **Add Environment Variables:**

   - Create a new environment
   - Add variable: `baseUrl` = `http://localhost:4000`

3. **Add Requests to Collection:**

   **Request 1: Health Check**

   - Name: "Health Check"
   - Method: `GET`
   - URL: `{{baseUrl}}/health`
   - Save to collection

   **Request 2: Create Feedback**

   - Name: "Create Feedback"
   - Method: `POST`
   - URL: `{{baseUrl}}/feedback`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "phone": "9876543210",
       "rating": 5,
       "feedback": "Great experience!"
     }
     ```
   - Save to collection

   **Request 3: Get Feedback (Newest First)**

   - Name: "Get Feedback - Newest First"
   - Method: `GET`
   - URL: `{{baseUrl}}/feedback?page=0&limit=10&sort=desc`
   - Save to collection

   **Request 4: Get Feedback (Oldest First)**

   - Name: "Get Feedback - Oldest First"
   - Method: `GET`
   - URL: `{{baseUrl}}/feedback?page=0&limit=10&sort=asc`
   - Save to collection

   **Request 5: Get Feedback (Paginated)**

   - Name: "Get Feedback - Page 2"
   - Method: `GET`
   - URL: `{{baseUrl}}/feedback?page=2&limit=25&sort=desc`
   - Save to collection

### Testing in Postman

1. **Select the environment** with `baseUrl` variable
2. **Run requests** individually or use the Collection Runner
3. **Check responses** in the Response section
4. **Verify status codes** match expected responses

---

## Error Handling

### Common Error Codes

| Status Code | Description           | Example                 |
| ----------- | --------------------- | ----------------------- |
| `200`       | OK                    | Successful GET request  |
| `201`       | Created               | Successful POST request |
| `400`       | Bad Request           | Missing required fields |
| `500`       | Internal Server Error | Server-side error       |

### Error Response Format

All error responses follow this format:

```json
{
  "message": "Error message description"
}
```

---

## Data Validation

### Feedback Creation Validation

- **name**: Required, must be a non-empty string (trimmed)
- **email**: Required, must be a non-empty string (trimmed)
- **phone**: Required, must be a non-empty string (trimmed)
- **rating**: Required, must be a number between 1 and 5 (inclusive)
- **feedback**: Required, must be a non-empty string (trimmed)

### Pagination Validation

- **page**: Must be >= 0 (defaults to 0 if invalid)
- **limit**: Must be between 1 and 100 (defaults to 10 if invalid, max 100)
- **sort**: Must be `asc` or `desc` (defaults to `desc` if invalid)

---

## Database Schema

### Feedback Collection

The feedback data is stored in MongoDB with the following schema:

```javascript
{
  name: String,        // Required, trimmed
  email: String,       // Required, trimmed
  phone: String,       // Required, trimmed
  rating: Number,      // Required, min: 1, max: 5
  feedback: String,    // Required, trimmed
  createdAt: Date,     // Auto-generated timestamp
  updatedAt: Date      // Auto-generated timestamp
}
```

---

## Testing Examples

### Test Case 1: Create Valid Feedback

**Request:**

```bash
POST http://localhost:4000/feedback
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "9876543212",
  "rating": 5,
  "feedback": "Excellent service! Highly recommended."
}
```

**Expected Response:** `201 Created`

### Test Case 2: Create Feedback with Missing Field

**Request:**

```bash
POST http://localhost:4000/feedback
Content-Type: application/json

{
  "name": "Bob Smith",
  "email": "bob.smith@example.com",
  "phone": "9876543213",
  "rating": 4
}
```

**Expected Response:** `400 Bad Request` with message "All fields are required"

### Test Case 3: Get Feedback with Pagination

**Request:**

```bash
GET http://localhost:4000/feedback?page=0&limit=5&sort=desc
```

**Expected Response:** `200 OK` with up to 5 feedback entries, sorted by newest first

### Test Case 4: Get Feedback (Oldest First)

**Request:**

```bash
GET http://localhost:4000/feedback?page=0&limit=10&sort=asc
```

**Expected Response:** `200 OK` with feedback entries sorted by oldest first

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All string fields are automatically trimmed of leading/trailing whitespace
- Rating must be an integer between 1 and 5
- Maximum limit per page is 100 items
- The API uses MongoDB for data storage
- CORS is enabled for cross-origin requests
- The server runs on port 4000 by default (configurable via environment variables)

---

## Support

For issues or questions about the API, please check:

- Server logs for error details
- Network tab in browser DevTools for request/response details
- MongoDB connection status if data is not being saved

---

## Version

**API Version:** 1.0.0  
**Last Updated:** January 2025
