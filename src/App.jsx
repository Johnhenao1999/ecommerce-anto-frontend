import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Categoria from './pages/Category';
import ProductoDetalle from './pages/ProductDetail';
import { useCart } from './context/CartContext';
import CartPanel from './components/CartPanel/CartPanel';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import './App.css';

function AppContent() {
  const { mostrarCarrito, setMostrarCarrito } = useCart();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:categoriaSlug" element={<Categoria />} />
        <Route path="/categoria/:categoriaSlug/:subcategoriaSlug" element={<Categoria />} />
        <Route path="/producto/:productoId" element={<ProductoDetalle />} />
      </Routes>

      {/* 👇 Este va fuera de <Routes> */}
      <CartPanel visible={mostrarCarrito} onClose={() => setMostrarCarrito(false)} />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
