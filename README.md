# ShopSense - AI-Powered Budget Recommender

ShopSense is a modern web application that helps users track their expenses and get AI-powered recommendations for better financial management. The application uses Auth0 for authentication, MongoDB for data storage, and Google's Gemini AI for generating personalized recommendations.

## Features

- 🔐 Secure authentication with Auth0
- 💰 Expense tracking and categorization
- 📊 Interactive data visualization
- 🤖 AI-powered spending recommendations
- 🛍️ Direct links to shopping and comparison sites
- 📱 Responsive design for all devices

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB Atlas account
- Auth0 account
- Google Cloud account with Gemini API access

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/budget_recommender.git
cd budget_recommender
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Domain Configuration
VITE_API_URL=http://localhost:3001
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience
VITE_AUTH0_CALLBACK_URL=http://localhost:5173/callback

# Server Configuration
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
AUTH0_AUDIENCE=your-auth0-audience
AUTH0_ISSUER_BASE_URL=your-auth0-issuer-base-url

# MongoDB Configuration
MONGODB_URI=your-mongodb-connection-string

# Gemini API Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key

# Auth0 Configuration
AUTH0_SECRET=your-auth0-secret
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_ISSUER_BASE_URL=your-auth0-issuer-base-url
AUTH0_BASE_URL=http://localhost:5173
```

## Setting Up External Services

### MongoDB Atlas
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and update the `MONGODB_URI` in your `.env` file

### Auth0
1. Create a free account on [Auth0](https://auth0.com)
2. Create a new application (Single Page Application)
3. Configure the following settings:
   - Allowed Callback URLs: `http://localhost:5173/callback`
   - Allowed Logout URLs: `http://localhost:5173`
   - Allowed Web Origins: `http://localhost:5173`
4. Update the Auth0-related variables in your `.env` file

### Google Cloud (Gemini API)
1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable the Gemini API
3. Create an API key
4. Update the `VITE_GEMINI_API_KEY` in your `.env` file

## Running the Application

1. Start the backend server:
```bash
cd server
node index.js
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
budget_recommender/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── services/          # API services
│   ├── styles/            # CSS styles
│   └── App.tsx            # Main application component
├── server/                # Backend server code
│   └── index.js          # Express server
├── public/               # Static files
└── package.json          # Project dependencies
```

## API Endpoints

- `GET /api/expenses` - Get all expenses for the authenticated user
- `POST /api/expenses` - Create a new expense
- `DELETE /api/expenses/:id` - Delete an expense
- `GET /api/health` - Health check endpoint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- [Auth0](https://auth0.com) for authentication
- [MongoDB](https://www.mongodb.com) for database
- [Google Gemini](https://cloud.google.com/vertex-ai) for AI recommendations
- [Chart.js](https://www.chartjs.org) for data visualization
