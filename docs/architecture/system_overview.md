# System Architecture

## Overview
The Budget Recommender is a full-stack web application built with modern technologies and following best practices.

## Tech Stack
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: Auth0
- Build Tool: Vite
- Styling: CSS Modules + Boxicons

## Architecture Diagram
```
┌─────────────────┐     ┌─────────────┐     ┌─────────────┐
│   React         │     │   Express   │     │   MongoDB   │
│  Frontend       │◄───►│   Server    │◄───►│  Database   │
│  Components:    │     └─────────────┘     └─────────────┘
│  - Auth         │            ▲                    ▲
│  - Dashboard    │            │                    │
│  - Profile      │            ▼                    ▼
│  - Settings     │     ┌─────────────┐     ┌─────────────┐
└─────────────────┘     │   Auth0     │     │   Client    │
                        │  Service    │     │   Browser   │
                        └─────────────┘     └─────────────┘
```

## Component Structure

### Frontend
- `App.tsx`: Main application component
- Components:
  - Auth:
    - SignIn
    - SignUp
    - AuthLayout
  - Dashboard:
    - Dashboard
    - Profile
    - Settings
  - Layout:
    - Header
    - Navigation
    - Footer
- Styles:
  - CSS Modules
  - Responsive design
  - Dark/Light mode

### Backend
- `server/index.js`: Main server file
- Routes:
  - `/expenses`: Expense management endpoints
  - `/profile`: User profile endpoints
  - `/settings`: User settings endpoints
- Models:
  - Expense schema
  - User schema

## Data Flow
1. User authenticates via Auth0
2. Frontend requests protected data with JWT
3. Backend validates JWT and processes request
4. MongoDB stores/retrieves data
5. Response sent back to frontend
6. UI updates with new data

## Security
- JWT-based authentication
- Protected API endpoints
- User data isolation
- Secure token handling
- CSRF protection
- Input validation 