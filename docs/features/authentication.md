# Authentication

## Overview
The application uses Auth0 for user authentication. This provides a secure and scalable way to manage user identities and access control.

## Implementation Details
- Uses Auth0's React SDK (`@auth0/auth0-react`)
- Implements JWT-based authentication
- Protected API endpoints with JWT validation

## Features
- User login/logout
- Silent token refresh
- Protected routes
- User profile information access

## Configuration
- Auth0 Domain: dev-m2w3ulj0iwxdhbtx.us.auth0.com
- Audience: http://localhost:3001
- Token Signing Algorithm: RS256

## Security Considerations
- Tokens are stored securely in memory
- API endpoints validate JWT tokens
- User-specific data is isolated by user ID 