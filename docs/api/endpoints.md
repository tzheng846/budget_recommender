# API Endpoints

## Authentication
All endpoints require JWT authentication. The token should be included in the Authorization header:
```
Authorization: Bearer <token>
```

## Expense Endpoints

### GET /expenses
Retrieves all expenses for the authenticated user.

**Response**
```json
[
  {
    "_id": "string",
    "description": "string",
    "amount": number,
    "category": "string",
    "createdAt": "string",
    "userId": "string"
  }
]
```

### POST /expenses
Creates a new expense.

**Request Body**
```json
{
  "description": "string",
  "amount": number,
  "category": "string"
}
```

**Response**
```json
{
  "_id": "string",
  "description": "string",
  "amount": number,
  "category": "string",
  "createdAt": "string",
  "userId": "string"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or missing token"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to process request",
  "details": "string"
}
``` 