import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { formatearCOP } from "../utils/format";
import FullScreenLoader from '../components/Loader/FullScreenLoader';
import "../styles/productDetail.css";

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const { agregarAlCarrito } = useCart();
  const { productos, loading, error } = useProducts();

  const [cantidad, setCantidad] = useState(1);
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    if (productos.length) {
      const encontrado = productos.find((p) => p.slug === productoId);
      setProducto(encontrado || null);
    }
  }, [productoId, productos]);


  if (loading) return <FullScreenLoader message="Cargando productos..." />;

  if (error) {
    return (
      <p style={{ textAlign: "center", padding: "40px", color: "red" }}>
        Error al cargar los productos: {error}
      </p>
    );
  }

  if (!producto) {
    return (
      <>
        <Header />
        <main className="producto-detalle">
          <p style={{ textAlign: "center", padding: "60px" }}>
            Producto no encontrado 🥺
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto, cantidad);
  };

  return (
    <>
      <Header />
      <main className="producto-detalle">
        {/* Imagen */}
        <img
          className="producto-detalle-img"
          src={producto.imagen}
          alt={producto.nombre}
        />

        {/* Información */}
        <div className="producto-detalle-info">
          <h1>
            {producto.nombre} {producto.marca ? `- ${producto.marca}` : ""}
          </h1>
          <p>{producto.descripcion}</p>

          <strong className="precio">
            {formatearCOP(producto.precio)}
          </strong>

          {/* Estado del stock */}
          <p className="disponibilidad">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="#129e20"
              viewBox="0 0 24 24"
              style={{ marginRight: "6px", verticalAlign: "middle" }}
            >
              <path d="M9 16.2l-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4z" />
            </svg>
            Disponible en stock
          </p>

          {/* Cantidad + botón */}
          <div className="producto-cantidad">
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
            <button onClick={handleAgregarAlCarrito} className="btn-agregar">
              Agregar al carrito
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ marginLeft: "6px" }}
              >
                <path d="M8 1a2 2 0 0 1 1.995 1.85L10 3h4.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.598l1.5-7A.5.5 0 0 1 5.5 3H10a2 2 0 0 1-2-2Zm2 3H5.5l-1.3 6h9.6l-1.3-6ZM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
              </svg>
            </button>
          </div>

          {/* Beneficios */}
          <div className="beneficios">
            <div>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 7l-1.41-1.41L12 13.17l-4.59-4.58L6 10l6 6z" />
              </svg>
              Cambios sin complicaciones
            </div>
            <div>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H7v4H4v12h16V8zM9 6h6v2H9V6zm9 12H6V10h12v8z" />
              </svg>
              Despachos rápidos
            </div>
            <div>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM5 11V6.3l7-3.11 7 3.11V11c0 4.21-2.82 8.13-7 9.43C7.82 19.13 5 15.21 5 11z" />
              </svg>
              Pagos seguros y confiables
            </div>
            <div>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 4H2v16h20V4zM4 18V6h16v12H4zm2-9h3v2H6v-2zm0 4h3v2H6v-2zm5-4h8v2h-8v-2zm0 4h8v2h-8v-2z" />
              </svg>
              Múltiples opciones de pago
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductoDetalle;
