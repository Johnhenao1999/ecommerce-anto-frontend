// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const agregarAlCarrito = (producto, cantidad) => {
    const precioFinal = producto.tieneDescuento
      ? producto.precioDescuento
      : producto.precio;

    const productoConPrecio = {
      ...producto,
      precioOriginal: producto.precio,     // útil para mostrar el precio tachado si hay descuento
      precio: precioFinal,                 // el precio final que se usará en el carrito
      cantidad,
    };

    const existente = cartItems.find(item => item._id === producto._id);

    if (existente) {
      setCartItems(cartItems.map(item =>
        (item.id === producto.id || item._id === producto._id)
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ));
    } else {
      setCartItems([...cartItems, productoConPrecio]);
    }

    setMostrarCarrito(true);
  };

  const incrementarCantidad = (productoId) => {
    setCartItems(cartItems.map(item =>
      item._id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item
    ));
  };

  const disminuirCantidad = (productoId) => {
    setCartItems(cartItems
      .map(item =>
        item._id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
      )
      .filter(item => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (productoId) => {
    setCartItems(cartItems.filter(item => item._id !== productoId));
  };

  const cantidadTotal = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      agregarAlCarrito,
      incrementarCantidad,
      disminuirCantidad,
      eliminarDelCarrito,
      cantidadTotal,
      mostrarCarrito,
      setMostrarCarrito,
    }}>
      {children}
    </CartContext.Provider>
  );
};
