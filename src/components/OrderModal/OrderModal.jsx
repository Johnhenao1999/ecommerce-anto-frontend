import React, { useState, useEffect } from "react";
import "./OrderModal.css";
import departamentosData from "../../data/departamentosColombia.json";

const OrderModal = ({ visible, onClose, onConfirm }) => {
  const [form, setForm] = useState({
    nombre: "",
    celular: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    formaPago: "Efectivo",
    observaciones: "",
    codigoDescuento: "", // ✅ nuevo campo
  });

  const [departamentosFiltrados, setDepartamentosFiltrados] = useState(departamentosData);
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
  const [showDeptoList, setShowDeptoList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);

  const [mensajeCodigo, setMensajeCodigo] = useState("");
  const [codigoValido, setCodigoValido] = useState(false);

  useEffect(() => {
    if (form.departamento) {
      const dep = departamentosData.find(
        (d) => d.departamento === form.departamento
      );
      setCiudades(dep ? dep.ciudades : []);
      setCiudadesFiltradas(dep ? dep.ciudades : []);
      setForm((prev) => ({ ...prev, ciudad: "" }));
    } else {
      setCiudades([]);
      setCiudadesFiltradas([]);
    }
  }, [form.departamento]);

  const handleDepartamentoChange = (value) => {
    setForm((prev) => ({ ...prev, departamento: value }));
    setShowDeptoList(false);
  };

  const handleCiudadChange = (value) => {
    setForm((prev) => ({ ...prev, ciudad: value }));
    setShowCityList(false);
  };

  const filtrarDepartamentos = (value) => {
    const filtro = value.toLowerCase();
    const filtrados = departamentosData.filter((dep) =>
      dep.departamento.toLowerCase().includes(filtro)
    );
    setDepartamentosFiltrados(filtrados);
    setForm((prev) => ({ ...prev, departamento: value }));
  };

  const filtrarCiudades = (value) => {
    const filtro = value.toLowerCase();
    const filtradas = ciudades.filter((c) =>
      c.toLowerCase().includes(filtro)
    );
    setCiudadesFiltradas(filtradas);
    setForm((prev) => ({ ...prev, ciudad: value }));
  };

  // ✅ Validar el código de descuento antes de confirmar
  const validarCodigo = async () => {
    if (!form.codigoDescuento.trim()) {
      setMensajeCodigo("⚠️ Ingresa un código antes de validar.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/suscriptores/validar/${form.codigoDescuento}`
      );
      const data = await res.json();

      if (res.ok && data.valido) {
        setCodigoValido(true);
        setMensajeCodigo(`✅ ${data.mensaje}`);
      } else {
        setCodigoValido(false);
        setMensajeCodigo(`❌ ${data.mensaje || "Código no válido"}`);
      }
    } catch (error) {
      console.error("❌ Error al validar código:", error);
      setMensajeCodigo("❌ Error al validar el código. Intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Solo se permite confirmar si el código es válido o está vacío
    if (form.codigoDescuento && !codigoValido) {
      setMensajeCodigo("⚠️ Valida tu código antes de confirmar el pedido.");
      return;
    }

    onConfirm(form);
  };

  if (!visible) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="order-modal-content animate-modal">
        <button className="close-icon" onClick={onClose}>✕</button>
        <h3>🛍️ Completa tu información</h3>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Ana Pérez"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>

          {/* Celular */}
          <div className="form-group">
            <label>Celular</label>
            <input
              type="tel"
              name="celular"
              placeholder="Ej: 3001234567"
              value={form.celular}
              onChange={(e) => setForm({ ...form, celular: e.target.value })}
              required
            />
          </div>

          {/* 📦 Código de descuento */}
          <div className="form-group coupon-group">
            <label>Código de descuento (opcional)</label>
            <div className="coupon-input">
              <input
                type="text"
                name="codigoDescuento"
                placeholder="Ej: ANTO10-AB123"
                value={form.codigoDescuento}
                onChange={(e) =>
                  setForm({
                    ...form,
                    codigoDescuento: e.target.value.toUpperCase(),
                  })
                }
              />
              <button
                type="button"
                onClick={validarCodigo}
                className="btn-validar"
              >
                Validar
              </button>
            </div>
            {mensajeCodigo && (
              <p
                className={`mensaje-codigo ${
                  codigoValido ? "valido" : "invalido"
                }`}
              >
                {mensajeCodigo}
              </p>
            )}
          </div>

          {/* Departamento filtrable */}
          <div className="form-group combo">
            <label>Departamento</label>
            <input
              type="text"
              placeholder="Selecciona un departamento"
              value={form.departamento}
              onFocus={() => setShowDeptoList(true)}
              onChange={(e) => filtrarDepartamentos(e.target.value)}
              required
              autoComplete="off"
            />
            {showDeptoList && (
              <ul className="combo-list">
                {departamentosFiltrados.length > 0 ? (
                  departamentosFiltrados.map((dep) => (
                    <li
                      key={dep.id}
                      onClick={() => handleDepartamentoChange(dep.departamento)}
                    >
                      {dep.departamento}
                    </li>
                  ))
                ) : (
                  <li className="no-results">No se encontró</li>
                )}
              </ul>
            )}
          </div>

          {/* Ciudad filtrable */}
          <div className="form-group combo">
            <label>Ciudad</label>
            <input
              type="text"
              placeholder={
                ciudades.length
                  ? "Selecciona una ciudad"
                  : "Primero selecciona un departamento"
              }
              value={form.ciudad}
              onFocus={() => ciudades.length && setShowCityList(true)}
              onChange={(e) => filtrarCiudades(e.target.value)}
              disabled={!ciudades.length}
              required
              autoComplete="off"
            />
            {showCityList && (
              <ul className="combo-list">
                {ciudadesFiltradas.length > 0 ? (
                  ciudadesFiltradas.map((c, i) => (
                    <li key={i} onClick={() => handleCiudadChange(c)}>
                      {c}
                    </li>
                  ))
                ) : (
                  <li className="no-results">No se encontró</li>
                )}
              </ul>
            )}
          </div>

          {/* Dirección */}
          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              placeholder="Ej: Calle 123 #45-67"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              required
            />
          </div>

          {/* Forma de pago */}
          <div className="form-group">
            <label>Forma de pago</label>
            <select
              name="formaPago"
              value={form.formaPago}
              onChange={(e) =>
                setForm({ ...form, formaPago: e.target.value })
              }
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Nequi">Nequi</option>
              <option value="Daviplata">Daviplata</option>
            </select>
          </div>

          {/* Observaciones */}
          <div className="form-group">
            <label>Observaciones (opcional)</label>
            <textarea
              name="observaciones"
              placeholder="Ej: Comentarios sobre el pedido, tonos preferidos o detalles de entrega 💖"
              value={form.observaciones || ""}
              onChange={(e) =>
                setForm({ ...form, observaciones: e.target.value })
              }
              rows={3}
              style={{ resize: "none" }}
            />
          </div>

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
