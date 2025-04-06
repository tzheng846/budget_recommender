# Expense Tracking

## Overview
The expense tracking system allows users to record and manage their expenses with basic categorization.

## Implementation Details
- MongoDB database storage
- RESTful API endpoints
- React frontend interface

## Features
- Add new expenses
- View expense history
- Total expense calculation
- Basic expense categorization

## Data Structure
```typescript
type Expense = {
  _id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
  userId: string;
}
```

## API Endpoints
- GET /expenses - Retrieve user's expenses
- POST /expenses - Add new expense

## Current Limitations
- No expense editing/deletion
- Basic category system
- No date filtering
- No budget limits 