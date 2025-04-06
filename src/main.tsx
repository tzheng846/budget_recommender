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
        redirect_uri: window.location.origin,
        audience: 'http://localhost:3001'
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)
