import React, { useState } from "react";
import "./Newsletter.css";

const Newsletter = () => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    whatsapp: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.correo || !form.whatsapp) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("https://tu-backend.com/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("✅ ¡Gracias! Te contactaremos por WhatsApp pronto.");
        setForm({ nombre: "", correo: "", whatsapp: "" });
      } else {
        setMensaje(data.error || "Hubo un error. Intenta más tarde.");
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setMensaje("❌ No se pudo enviar. Intenta más tarde.");
    }
  };

  return (
    <section className="newsletter">
      <h2>Suscríbete y obtén un 10% de descuento</h2>
      <p>Te contactamos por WhatsApp con el cupón.</p>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Tu nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="whatsapp"
          placeholder="Número de WhatsApp"
          value={form.whatsapp}
          onChange={handleChange}
        />
        <button type="submit">Suscribirme</button>
      </form>

      {mensaje && <p className="newsletter-mensaje">{mensaje}</p>}
    </section>
  );
};

export default Newsletter;
