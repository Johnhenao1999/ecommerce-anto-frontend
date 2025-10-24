import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import OrderModal from '../OrderModal/OrderModal';
import SuccessModal from "../SuccessModal/SuccessModal";
import { formatearCOP } from '../../utils/format';
import './CartPanel.css';

const CartPanel = ({ visible, onClose }) => {
  const { cartItems, incrementarCantidad, disminuirCantidad, eliminarDelCarrito, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formaPagoCliente, setFormaPagoCliente] = useState("");

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  // 🧠 Bloquear scroll del fondo cuando hay modales abiertos
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Limpieza al desmontar
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);

  const handleConfirmOrder = async (userData) => {
    const payload = {
      cliente: userData,
      items: cartItems.map(item => ({
        id: item._id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
      total,
    };

    try {
      console.log("📦 Enviando orden al backend:", payload);

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("❌ Error al guardar la orden en el backend");
        alert("Hubo un problema al guardar tu orden. Intenta nuevamente.");
        return;
      }

      const data = await res.json();
      console.log("✅ Orden guardada con éxito:", data);

      // 🟢 Mostrar modal de éxito
      setFormaPagoCliente(userData.formaPago);
      setShowSuccess(true);

      // 🔒 Cerrar modal de ingreso de datos
      setShowModal(false);

      // 🧹 Vaciar carrito después del pedido
      clearCart();

    } catch (err) {
      console.error("❌ Error de red al guardar la orden:", err);
      alert("No se pudo enviar la orden al servidor.");
    }
  };

  return (
    <>
      {/* 🔹 Panel visible solo si no hay modales activos */}
      {visible && !showModal && !showSuccess && (
        <>
          <div className="cart-backdrop" onClick={onClose}></div>

          <div className={`cart-panel visible`}>
            <div className="cart-header">
              <div className="cart-title">
                <h2>Mi carrito</h2>
              </div>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            {cartItems.length === 0 ? (
              <p style={{ padding: "16px" }}>No hay productos en el carrito.</p>
            ) : (
              <div className="cart-panel-content">
                <ul className="cart-list">
                  {cartItems.map(item => (
                    <li key={item._id} className="cart-item">
                      <div className='item-header'>
                        <img src={item.imagen} width={80} alt={item.nombre} />
                        <strong>{item.nombre}</strong>
                      </div>
                      <div className="item-controls">
                        <button className='qty-btn' onClick={() => disminuirCantidad(item._id)}>−</button>
                        <input type="number" value={item.cantidad} readOnly />
                        <button className='qty-btn' onClick={() => incrementarCantidad(item._id)}>+</button>
                      </div>
                      <div>
                        <span>Subtotal: {formatearCOP(item.precio * item.cantidad)}</span>
                      </div>
                      <button className='delete-btn' onClick={() => eliminarDelCarrito(item._id)}>Eliminar</button>
                    </li>
                  ))}
                </ul>

                <div className="cart-footer">
                  <h3>Total: {formatearCOP(total)}</h3>
                  <div className="cart-actions">
                    <button
                      className="btn-order"
                      onClick={() => setShowModal(true)}
                    >
                      Realizar orden
                    </button>
                    <button className="btn-secondary" onClick={onClose}>
                      Seguir comprando
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* 🔹 Modal de datos del usuario */}
      <OrderModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmOrder}
      />

      {/* 🔹 Modal de éxito */}
      <SuccessModal
        visible={showSuccess}
        formaPago={formaPagoCliente}
        onClose={() => {
          setShowSuccess(false);
          onClose(); // cierra todo el flujo
        }}
      />
    </>
  );
};

export default CartPanel;
