// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // 🧩 Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // 💾 Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ Agregar producto
  const agregarAlCarrito = (producto, cantidad) => {
    const precioFinal = producto.tieneDescuento
      ? producto.precioDescuento
      : producto.precio;

    const productoConPrecio = {
      ...producto,
      precioOriginal: producto.precio,
      precio: precioFinal,
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

  // 🔺 Incrementar cantidad
  const incrementarCantidad = (productoId) => {
    setCartItems(cartItems.map(item =>
      item._id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item
    ));
  };

  // 🔻 Disminuir cantidad
  const disminuirCantidad = (productoId) => {
    setCartItems(cartItems
      .map(item =>
        item._id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
      )
      .filter(item => item.cantidad > 0)
    );
  };

  // ❌ Eliminar producto
  const eliminarDelCarrito = (productoId) => {
    setCartItems(cartItems.filter(item => item._id !== productoId));
  };

  // 🔢 Total de productos
  const cantidadTotal = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  // 🧹 Vaciar carrito (cuando se confirme la orden)
  const clearCart = () => {
    setCartItems([]);
    setMostrarCarrito(false);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        agregarAlCarrito,
        incrementarCantidad,
        disminuirCantidad,
        eliminarDelCarrito,
        cantidadTotal,
        mostrarCarrito,
        setMostrarCarrito,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
