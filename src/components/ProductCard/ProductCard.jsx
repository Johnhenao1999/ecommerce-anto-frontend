// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../ProductCard/ProductCard.css';

const ProductCard = ({ producto }) => {
  const { agregarAlCarrito } = useCart();
  return (
    <>
      <div className="producto-card">
        <Link to={`/producto/${producto.id}`}>
          <img src={producto.imagen} alt={producto.nombre} width={250} />
        </Link>
        <span>{producto.marca}</span>
        <Link to={`/producto/${producto.id}`}>
          <h3>{producto.nombre}</h3>
        </Link>
        <div className='container-button-price'>
          <strong className='price-card'>${producto.precio}</strong>
          <button
            className="btn-carrito"
            onClick={() => {
              agregarAlCarrito(producto, 1);
            }}
          >
            Agregar al carrito
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 1.995 1.85L10 3h4.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.598l1.5-7A.5.5 0 0 1 5.5 3H10a2 2 0 0 1-2-2Zm2 3H5.5l-1.3 6h9.6l-1.3-6ZM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
