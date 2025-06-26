import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const agregarAlCarrito = (producto, cantidad) => {
    const existente = cartItems.find(item => item.id === producto.id);

    if (existente) {
      setCartItems(cartItems.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
      ));
    } else {
      setCartItems([...cartItems, { ...producto, cantidad }]);
    }
    setMostrarCarrito(true); // 👈 Mostrar el panel al agregar
  };

  const incrementarCantidad = (productoId) => {
    setCartItems(cartItems.map(item =>
      item.id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item
    ));
  };

  const disminuirCantidad = (productoId) => {
    setCartItems(cartItems
      .map(item =>
        item.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
      )
      .filter(item => item.cantidad > 0) // elimina si llega a 0
    );
  };

  const eliminarDelCarrito = (productoId) => {
    setCartItems(cartItems.filter(item => item.id !== productoId));
  };

  const cantidadTotal = cartItems.length;

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
