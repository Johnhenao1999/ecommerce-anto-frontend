import React from "react";
import "../../styles/OrderDetailModal.css";

const OrderDetailModal = ({ visible, onClose, order }) => {
  if (!visible || !order) return null;

  const { cliente, items, total, estado, createdAt, codigoDescuento } = order;

  const fechaFormateada = new Date(createdAt).toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="modal-backdrop">
      <div className="order-modal">
        <div className="modal-header">
          <h3>Detalle del Pedido</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* 🧍 Información del Cliente */}
          <section className="info-cliente">
            <h4>Cliente</h4>
            <p><strong>Nombre:</strong> {cliente?.nombre}</p>
            <p><strong>Celular:</strong> {cliente?.celular}</p>
            <p><strong>Dirección:</strong> {cliente?.direccion}</p>
            <p>
              <strong>Ciudad:</strong> {cliente?.ciudad}, {cliente?.departamento}
            </p>
            <p><strong>Forma de pago:</strong> {cliente?.formaPago}</p>

            {/* 💬 Observaciones */}
            {cliente?.observaciones && (
              <p className="observaciones">
                <strong>Observaciones:</strong> {cliente.observaciones}
              </p>
            )}

            {/* 🎟️ Código de descuento */}
            {codigoDescuento && (
              <p className="codigo-descuento">
                <strong>Código de descuento aplicado:</strong> {codigoDescuento}
              </p>
            )}

            <p><strong>Estado actual:</strong> {estado}</p>
            <p><strong>Fecha de pedido:</strong> {fechaFormateada}</p>
          </section>

          {/* 🛍️ Productos del Pedido */}
          <section className="info-items">
            <h4>Productos</h4>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precio.toLocaleString("es-CO")}</td>
                    <td>${(item.precio * item.cantidad).toLocaleString("es-CO")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="total">
              <strong>Total: </strong>
              <span>${total.toLocaleString("es-CO")}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
