import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Categoria from './pages/Category';
import ProductoDetalle from './pages/ProductDetail';
import { useCart } from './context/CartContext';
import CartPanel from './components/CartPanel/CartPanel';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import AddProducts from './pages/admin/AddProducts';
import ProductList from './pages/admin/ProductList';
import CrearCategoria from './pages/admin/AddCategory';
import AdminHome from './pages/admin/AdminHome';
import Login from './pages/Login';
import RutaProtegida from './components/RutaProtegida'; // 👈 asegurarte de que esté en components
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
        
        {/* 🛡️ Rutas protegidas */}
        <Route path="/admin" element={
          <RutaProtegida><AdminHome /></RutaProtegida>
        } />
        <Route path="/admin/agregar-productos" element={
          <RutaProtegida><AddProducts /></RutaProtegida>
        } />
        <Route path="/admin/list-products" element={
          <RutaProtegida><ProductList /></RutaProtegida>
        } />
        <Route path="/admin/create-category" element={
          <RutaProtegida><CrearCategoria /></RutaProtegida>
        } />

        {/* 🔓 Ruta pública */}
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* 👇 Elementos persistentes */}
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
