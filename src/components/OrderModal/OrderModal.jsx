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
  });

  const [departamentosFiltrados, setDepartamentosFiltrados] = useState(departamentosData);
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
  const [showDeptoList, setShowDeptoList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);

  useEffect(() => {
    if (form.departamento) {
      const dep = departamentosData.find(
        (d) => d.departamento === form.departamento
      );
      setCiudades(dep ? dep.ciudades : []);
      setCiudadesFiltradas(dep ? dep.ciudades : []);
      setForm((prev) => ({ ...prev, ciudad: "" })); // reset ciudad
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
              onChange={(e) => setForm({ ...form, formaPago: e.target.value })}
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Nequi">Nequi</option>
              <option value="Daviplata">Daviplata</option>
            </select>
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
