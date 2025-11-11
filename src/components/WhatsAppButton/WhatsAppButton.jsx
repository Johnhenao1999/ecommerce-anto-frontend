// src/components/WhatsAppButton/WhatsAppButton.jsx
import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const phoneNumber = '573166427101';
  const message = 'Hola, necesito ayuda con mi compra.';

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Chatea con soporte por WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.555 7.555 0 0 0 8.026 0C3.6 0 .028 3.573.028 7.998c0 1.41.37 2.78 1.073 3.984L0 16l4.112-1.079A7.94 7.94 0 0 0 8.026 16c4.426 0 8.001-3.573 8.001-7.999a7.564 7.564 0 0 0-2.426-5.675zM8.026 14.48c-1.229 0-2.436-.325-3.489-.94l-.25-.148-2.442.64.652-2.379-.16-.245a6.43 6.43 0 0 1-.986-3.41 6.457 6.457 0 0 1 6.475-6.476c1.735 0 3.364.676 4.592 1.904a6.433 6.433 0 0 1 1.905 4.572c0 3.578-2.915 6.482-6.497 6.482z" />
        <path d="M11.194 9.653c-.171-.087-1.015-.502-1.173-.559-.157-.058-.272-.087-.386.087-.115.173-.443.558-.543.673-.1.115-.2.129-.372.043-.171-.087-.725-.267-1.38-.853-.51-.454-.854-1.015-.955-1.186-.1-.172-.01-.265.077-.352.079-.078.171-.2.257-.3.086-.1.114-.172.172-.287.058-.115.029-.215-.014-.302-.043-.086-.386-.931-.529-1.27-.14-.34-.284-.29-.386-.295l-.33-.006a.64.64 0 0 0-.46.215c-.158.173-.601.588-.601 1.433s.615 1.661.7 1.774c.086.114 1.207 1.85 2.93 2.595 1.723.744 1.723.497 2.033.467.31-.029 1.015-.415 1.158-.816.144-.4.144-.744.1-.816-.043-.072-.157-.115-.328-.201z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
