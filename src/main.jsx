import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import './responsive.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import { DoctorFilterProvider } from "./context/DoctorFilterContext.jsx";
import { LocationProvider } from './context/LocationContext.jsx'
const clientId = "557489215409-a0rif69gfasneviivhljie30l8nih3ht.apps.googleusercontent.com";
createRoot(document.getElementById('root')).render(
  <>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <CartProvider>
          <DoctorFilterProvider>
            <LocationProvider>
              <App />
            </LocationProvider>
          </DoctorFilterProvider>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </>
)