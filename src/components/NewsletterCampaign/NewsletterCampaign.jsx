import React, { useState } from "react";
import "./NewsletterCampaign.css";

const NewsletterCampaign = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        telefono: "",
    });
    const [mensaje, setMensaje] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [fechaExpiracion, setFechaExpiracion] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.correo || !formData.telefono) {
            setMensaje("⚠️ Por favor completa todos los campos.");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/suscriptores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setMensaje(data.error || "Error al registrar la suscripción.");
                return;
            }

            // ✅ Mensaje de éxito
            setEnviado(true);
            setMensaje(data.mensaje);

            // ✅ Código de descuento
            setCodigo(data.codigoDescuento || "⚠️ No se generó código");

            // ✅ Fecha de expiración (directa o anidada)
            const fecha = data.fechaExpiracion || data.suscriptor?.fechaExpiracion;
            if (fecha) setFechaExpiracion(fecha);

            setFormData({ nombre: "", correo: "", telefono: "" });
        } catch (error) {
            console.error("❌ Error al enviar el formulario:", error);
            setMensaje("❌ Ocurrió un error. Inténtalo nuevamente.");
        }
    };

    // 🗓️ Función para formatear la fecha
    const formatDate = (dateString) => {
        const fecha = new Date(dateString);
        const opciones = { year: "numeric", month: "long", day: "numeric" };
        return fecha.toLocaleDateString("es-ES", opciones);
    };

    return (
        <section className="newsletter-container">
            <div className="newsletter-content">
                <h2>🎁 ¡Suscríbete y recibe tu bono de descuento!</h2>
                <p>
                    Déjanos tus datos y obtén un <strong>10% de descuento</strong> en tu
                    primera compra.
                </p>

                {!enviado ? (
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="correo"
                            placeholder="Correo electrónico"
                            value={formData.correo}
                            onChange={handleChange}
                        />
                        <input
                            type="tel"
                            name="telefono"
                            placeholder="Número de WhatsApp"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        <button type="submit">Suscribirme</button>
                    </form>
                ) : (
                    <div className="newsletter-success coupon-card">
                        <p className="success-text">{mensaje}</p>

                        <div className="coupon-code-box">
                            <p className="discount-code">
                                🎟️ Tu código: <strong>{codigo}</strong>
                            </p>
                            {fechaExpiracion && (
                                <p className="discount-expiration">
                                    🕒 Válido hasta:{" "}
                                    <strong>{formatDate(fechaExpiracion)}</strong>
                                </p>
                            )}
                        </div>

                        <small className="coupon-note">
                            Úsalo al finalizar tu compra 🛍️
                        </small>
                    </div>
                )}

                {mensaje && !enviado && (
                    <p className="newsletter-message">{mensaje}</p>
                )}
            </div>
        </section>
    );
};

export default NewsletterCampaign;
