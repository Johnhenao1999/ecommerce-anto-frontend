// Newsletter.jsx
import React from "react";
import "./Newsletter.css";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <h2>Mantente hermosa</h2>
      <p>Suscríbete a nuestra newsletter para recibir consejos de belleza y ofertas exclusivas.</p>
      <form className="newsletter-form">
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Suscribirse</button>
      </form>
    </section>
  );
};

export default Newsletter;
