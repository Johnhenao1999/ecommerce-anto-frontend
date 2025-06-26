import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../utils/data.json';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useCart } from '../context/CartContext';
import '../styles/productDetail.css';

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const { agregarAlCarrito } = useCart();
  const [cantidad, setCantidad] = useState(1);

  let producto = null;

  data.categorias.forEach(cat => {
    if (cat.productos) {
      producto = cat.productos.find(p => p.id === parseInt(productoId)) || producto;
    }
    if (cat.subcategorias) {
      cat.subcategorias.forEach(sub => {
        producto = sub.productos.find(p => p.id === parseInt(productoId)) || producto;
      });
    }
  });

  if (!producto) return <p>Producto no encontrado</p>;

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto, cantidad);
  };

  return (
    <>
      <Header />
      <main className="producto-detalle">
        <img
          className="producto-detalle-img"
          src={`${producto.imagen}`}
          alt={producto.nombre}
        />
        <div className="producto-detalle-info">
          <h1>{producto.nombre} - {producto.marca}</h1>
          <p>{producto.descripcion}</p>
          <strong>${producto.precio}</strong>

          <p className="disponibilidad">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#129e20" viewBox="0 0 24 24" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
              <path d="M9 16.2l-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4z" />
            </svg>
            Disponible en stock
          </p>

          <div className="producto-cantidad">
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
            <button onClick={handleAgregarAlCarrito} className="btn-agregar">
              Agregar al carrito
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 1.995 1.85L10 3h4.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.598l1.5-7A.5.5 0 0 1 5.5 3H10a2 2 0 0 1-2-2Zm2 3H5.5l-1.3 6h9.6l-1.3-6ZM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
              </svg>
            </button>
          </div>

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
