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
        <Route path="/admin/agregar-productos" element={<AddProducts />} />
        <Route path="/admin/list-products" element={<ProductList />} />
        <Route path="/admin/create-category" element={<CrearCategoria />} />
        <Route path="/admin" element={<AdminHome />} />
        {/* Puedes agregar más rutas aquí según sea necesario */}
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
