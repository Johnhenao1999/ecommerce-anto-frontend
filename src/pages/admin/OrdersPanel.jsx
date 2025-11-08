import { useState, useEffect } from "react";
import "../../styles/OrdersPanel.css";
import Navbar from "../../components/Navbar/Navbar";
import { API_BASE } from "../../utils/api";
import OrderDetailModal from "./OrderDetailModal";

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [mensaje, setMensaje] = useState("");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  // 🟢 Enviar mensaje por WhatsApp
  const enviarMensajeWhatsApp = (orden) => {
    const { cliente, items, total } = orden;

    const detalle = items.map(
      (item) => `• ${item.nombre} x${item.cantidad} - $${item.precio.toLocaleString("es-CO")}`
    ).join("\n");

    const mensaje =
      `Hola ${cliente.nombre} 👋
Hemos recibido tu pedido con éxito 🛍️

🧾 *Detalle del pedido:*
${detalle}

💰 *Total:* $${total.toLocaleString("es-CO")}
📍 *Dirección:* ${cliente.direccion}, ${cliente.ciudad}
💳 *Forma de pago:* ${cliente.formaPago}

Muchas gracias por tu compra.💖`;

    // Formatea el número del cliente (ej: elimina espacios y agrega código país)
    const numero = cliente.celular.replace(/\D/g, ""); // quita todo lo que no sea número
    const numeroCompleto = numero.startsWith("57") ? numero : `57${numero}`; // 🇨🇴

    const url = `https://wa.me/${numeroCompleto}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
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
                  <th>Código</th>
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
                    <td>{orden.codigoDescuento || "-"}</td>
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
                    <td className="acciones">
                      <button
                        className="btn-detalle"
                        onClick={() => {
                          setOrdenSeleccionada(orden);
                          setShowModal(true);
                        }}
                      >
                        Ver detalles
                      </button>

                      {/* 🟢 Botón WhatsApp */}
                      <button
                        className="btn-wpp"
                        onClick={() => enviarMensajeWhatsApp(orden)}
                        title="Contactar por WhatsApp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M12 .5C5.65.5.5 5.65.5 12c0 2.09.55 4.05 1.51 5.77L.5 23.5l5.93-1.54A11.45 11.45 0 0 0 12 23.5c6.35 0 11.5-5.15 11.5-11.5S18.35.5 12 .5zm6.22 16.45c-.27.76-1.61 1.46-2.25 1.55-.58.09-1.29.13-2.09-.13-.48-.16-1.1-.36-1.89-.7-3.32-1.43-5.47-4.77-5.64-5-.16-.23-1.34-1.79-1.34-3.43 0-1.63.83-2.43 1.12-2.76.29-.34.63-.43.84-.43.21 0 .42 0 .6.01.19.01.45-.07.7.54.27.63.9 2.19.98 2.35.08.16.13.34.03.55-.09.21-.13.34-.27.53-.13.18-.29.41-.41.55-.13.14-.27.3-.12.58.14.29.63 1.03 1.35 1.68.93.83 1.71 1.1 2 .12.25-.79.48-1.02.88-1.16.41-.13.66-.07 1.12.35.45.42 1.57 1.32 1.84 1.56.27.23.45.35.52.54.06.19.06 1.11-.21 1.87z" />
                        </svg>
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
