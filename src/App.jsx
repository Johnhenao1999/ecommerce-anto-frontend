import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Categoria from "./pages/Category";
import ProductoDetalle from "./pages/ProductDetail";
import { useCart } from "./context/CartContext";
import CartPanel from "./components/CartPanel/CartPanel";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import AddProducts from "./pages/admin/AddProducts";
import ProductList from "./pages/admin/ProductList";
import CrearCategoria from "./pages/admin/AddCategory";
import AdminHome from "./pages/admin/AdminHome";
import Login from "./pages/Login";
import Categories from "./pages/admin/Categories";
import RutaProtegida from "./components/RutaProtegida";
import OrdersPanel from "./pages/admin/OrdersPanel";
import { Analytics } from "@vercel/analytics/react";
import { ProductProvider } from "./context/ProductContext";
import { CategoryProvider } from "./context/CategoryContext";
import Checkout from "./pages/Checkout";
import "./App.css";

// ⚙️ Componente para renderizar Analytics solo si NO estás en rutas admin/login
const ConditionalAnalytics = () => {
  const location = useLocation();
  const { pathname } = location;

  const isExcluded =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login");

  if (isExcluded) return null;
  return <Analytics />;
};

function AppContent() {
  const { mostrarCarrito, setMostrarCarrito } = useCart();

  return (
    <>
      <Routes>
        {/* 🏠 Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:categoriaSlug" element={<Categoria />} />
        <Route path="/categoria/:categoriaSlug/:subcategoriaSlug" element={<Categoria />} />
        <Route path="/producto/:productoId" element={<ProductoDetalle />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* 🛡️ Rutas protegidas */}
        <Route path="/admin" element={<RutaProtegida><AdminHome /></RutaProtegida>} />
        <Route path="/admin/agregar-productos" element={<RutaProtegida><AddProducts /></RutaProtegida>} />
        <Route path="/admin/list-products" element={<RutaProtegida><ProductList /></RutaProtegida>} />
        <Route path="/admin/crear-categoria" element={<RutaProtegida><CrearCategoria /></RutaProtegida>} />
        <Route path="/admin/categorias" element={<RutaProtegida><Categories /></RutaProtegida>} />
        <Route path="/admin/ordenes" element={<RutaProtegida><OrdersPanel /></RutaProtegida>} />

        {/* 🔓 Ruta pública */}
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* 🛒 Panel del carrito y botón de WhatsApp */}
      <CartPanel visible={mostrarCarrito} onClose={() => setMostrarCarrito(false)} />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ProductProvider>
        <CategoryProvider>
          <AppContent />
          <ConditionalAnalytics />
        </CategoryProvider>
      </ProductProvider>
    </Router>
  );
}
