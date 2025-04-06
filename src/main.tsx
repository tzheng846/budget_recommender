import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-m2w3ulj0iwxdhbtx.us.auth0.com"
      clientId="5OAi7b9VpbxalhkVjCB5682dE5EJISr1"
      authorizationParams={{
        redirect_uri: 'http://localhost:5173',
        audience: 'http://localhost:3001',
        scope: 'openid profile email'
      }}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)
