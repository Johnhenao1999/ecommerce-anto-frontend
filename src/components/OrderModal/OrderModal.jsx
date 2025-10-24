import React, { useState } from "react";
import "./OrderModal.css";

const OrderModal = ({ visible, onClose, onConfirm }) => {
  const [form, setForm] = useState({
    nombre: "",
    celular: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    formaPago: "Efectivo",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(form);
  };

  if (!visible) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="order-modal">
        <h3>Completa tu información</h3>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <label>Celular</label>
          <input
            type="tel"
            name="celular"
            value={form.celular}
            onChange={handleChange}
            required
          />

          <label>Departamento</label>
          <input
            type="text"
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
            required
          />

          <label>Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
            required
          />

          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            required
          />

          <label>Forma de pago</label>
          <select
            name="formaPago"
            value={form.formaPago}
            onChange={handleChange}
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Nequi">Nequi</option>
            <option value="Daviplata">Daviplata</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="btn-confirm">
              Confirmar pedido
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default OrderModal;
