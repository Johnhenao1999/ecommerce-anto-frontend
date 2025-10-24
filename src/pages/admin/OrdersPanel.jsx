import React, { useState, useEffect } from "react";
import "../../styles/OrdersPanel.css";
import Navbar from "../../components/Navbar/Navbar";
import { API_BASE } from "../../utils/api";
import OrderDetailModal from "./OrderDetailModal";

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [mensaje, setMensaje] = useState("");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null); // 👈 nueva línea
  const [showModal, setShowModal] = useState(false); // 👈 nueva línea

  const estados = ["Todos", "Recibido", "En preparación", "En camino", "Listo", "Cancelado"];

  useEffect(() => {
    obtenerOrdenes();
  }, []);

  const obtenerOrdenes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      setOrders(data.ordenes || []);
    } catch (error) {
      console.error("❌ Error al obtener órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar el estado");
      setMensaje("✅ Estado actualizado correctamente");
      obtenerOrdenes();
      setTimeout(() => setMensaje(""), 2500);
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
      setMensaje("❌ No se pudo actualizar el estado");
    }
  };

  const filtrarOrdenes = () => {
    if (filtroEstado === "Todos") return orders;
    return orders.filter((orden) => orden.estado === filtroEstado);
  };

  return (
        <>
          <Navbar />
    <div className="orders-panel section-admin">
      <h2>Gestión de Órdenes</h2>

      {mensaje && <div className="message">{mensaje}</div>}

      <div className="orders-controls">
        <label>Filtrar por estado:</label>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          {estados.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading">Cargando órdenes...</p>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Ciudad</th>
                <th>Forma de Pago</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrarOrdenes().map((orden, index) => (
                <tr key={orden._id}>
                  <td>{index + 1}</td>
                  <td>{orden.cliente?.nombre}</td>
                  <td>{orden.cliente?.celular}</td>
                  <td>{orden.cliente?.ciudad}</td>
                  <td>{orden.cliente?.formaPago}</td>
                  <td>${orden.total.toLocaleString("es-CO")}</td>
                  <td>
                    <select
                      value={orden.estado}
                      onChange={(e) => actualizarEstado(orden._id, e.target.value)}
                      className={`estado-select ${orden.estado.toLowerCase().replace(" ", "-")}`}
                    >
                      {estados.slice(1).map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-detalle"
                      onClick={() => {
                        setOrdenSeleccionada(orden);
                        setShowModal(true);
                      }}
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalle */}
      <OrderDetailModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        order={ordenSeleccionada}
      />
    </div>
    </>
  );
};

export default OrdersPanel;
