import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { API_BASE } from "../utils/api";
import { formatearCOP } from "../utils/format";
import Header from "../components/Header/Header";
import departamentosData from "../data/departamentosColombia.json";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "../styles/checkout.css";

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: "",
        celular: "",
        departamento: "",
        ciudad: "",
        direccion: "",
        formaPago: "Efectivo",
        observaciones: "",
    });

    const [departamentosFiltrados, setDepartamentosFiltrados] = useState(departamentosData);
    const [ciudades, setCiudades] = useState([]);
    const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
    const [showDeptoList, setShowDeptoList] = useState(false);
    const [showCityList, setShowCityList] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const deptoRef = useRef(null);
    const cityRef = useRef(null);

    const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => navigate("/"), 5000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    useEffect(() => {
        if (form.departamento) {
            const dep = departamentosData.find((d) => d.departamento === form.departamento);
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
        const filtradas = ciudades.filter((c) => c.toLowerCase().includes(filtro));
        setCiudadesFiltradas(filtradas);
        setForm((prev) => ({ ...prev, ciudad: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert("Tu carrito está vacío 🛒");
            return;
        }

        const payload = {
            cliente: form,
            items: cartItems.map((item) => ({
                id: item._id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
            })),
            total,
        };

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                alert("Hubo un problema al guardar tu orden. Intenta nuevamente.");
                return;
            }

            setSuccess(true);
            clearCart();
        } catch (err) {
            console.error("❌ Error al enviar orden:", err);
            alert("No se pudo enviar la orden al servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (deptoRef.current && !deptoRef.current.contains(event.target)) {
                setShowDeptoList(false);
            }
            if (cityRef.current && !cityRef.current.contains(event.target)) {
                setShowCityList(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (success) {
        return (
            <div className="checkout-success">
                <div className="success-icon">✔</div>
                <h2>🎉 ¡Pedido confirmado!</h2>
                <p>Tu pedido fue registrado exitosamente. Te contactaremos pronto.</p>
                <button className="btn-home" onClick={() => navigate("/")}>
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="checkout-container">
                {/* IZQUIERDA: Formulario */}
                <div className="checkout-form">
                    <h3>Completa tu información</h3>
                    <form onSubmit={handleSubmit}>
                        {/* Nombre */}
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                required
                            />
                        </div>

                        {/* Celular */}
                        <div className="form-group">
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                value={form.celular}
                                onChange={(e) => setForm({ ...form, celular: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group combo" ref={deptoRef}>
                                <input
                                    type="text"
                                    placeholder="Departamento"
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


                            {/* Ciudad */}
                            <div className="form-group combo" ref={cityRef}>
                                <input
                                    type="text"
                                    placeholder={
                                        ciudades.length
                                            ? "Ciudad"
                                            : "Ciudad"
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
                        </div>

                        {/* Dirección */}
                        <div className="form-group">
                            <label>Dirección</label>
                            <input
                                type="text"
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
                                value={form.formaPago}
                                onChange={(e) => setForm({ ...form, formaPago: e.target.value })}
                                required
                            >
                                {/* 🔹 Mostrar “Efectivo” solo si la ciudad es Guadalajara de Buga */}
                                {form.ciudad.trim().toLowerCase() === "guadalajara de buga" && (
                                    <option value="Efectivo">Efectivo</option>
                                )}

                                <option value="Nequi">Nequi</option>
                                <option value="Daviplata">Bancolombia</option>
                            </select>

                            {/* 🔹 Mensaje de ayuda UX */}
                            {form.ciudad.trim().toLowerCase() !== "guadalajara de buga" && (
                                <small style={{ fontSize: "12px", color: "#666" }}>
                                    El pago en efectivo solo está disponible para envíos dentro de Guadalajara de Buga
                                </small>
                            )}
                        </div>


                        {/* Observaciones */}
                        <div className="form-group">
                            <label>Observaciones (opcional)</label>
                            <textarea
                                placeholder="Escribe aquí cualquier indicación adicional..."
                                value={form.observaciones}
                                onChange={(e) =>
                                    setForm({ ...form, observaciones: e.target.value })
                                }
                                rows={3}
                                style={{ resize: "none" }}
                            />
                        </div>

                        <button type="submit" className="btn-confirm" disabled={loading}>
                            {loading ? "Procesando..." : "Confirmar pedido"}
                        </button>
                    </form>
                </div>

                {/* DERECHA: Resumen */}
                <div className="checkout-summary">
                    <h3>Resumen del pedido</h3>
                    {cartItems.length === 0 ? (
                        <p>No hay productos en el carrito.</p>
                    ) : (
                        <>
                            <ul className="summary-list">
                                {cartItems.map((item) => (
                                    <li key={item._id} className="summary-item">
                                        <img src={item.imagen} alt={item.nombre} />
                                        <div className="item-info">
                                            <h4>{item.nombre}</h4>
                                            <p>
                                                {item.cantidad} x {formatearCOP(item.precio)}
                                            </p>
                                        </div>
                                        <span className="subtotal">
                                            {formatearCOP(item.precio * item.cantidad)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="summary-total">
                                <strong>Total:</strong>
                                <span>{formatearCOP(total)}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Checkout;
