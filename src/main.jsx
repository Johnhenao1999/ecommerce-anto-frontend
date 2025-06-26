import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/variables.css';
import './styles/base.css';
import { CartProvider } from './context/CartContext';



createRoot(document.getElementById('root')).render(
  <CartProvider>
    <App />
  </CartProvider>
)
