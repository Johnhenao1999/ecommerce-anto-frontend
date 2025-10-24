import "./SuccessModal.css";

const SuccessModal = ({ visible, onClose, formaPago }) => {
  if (!visible) return null;

  const mostrarAviso = formaPago !== "Efectivo";

  return (
    <div className="success-backdrop">
      <div className="success-modal">
        <div className="icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" width={40} height={40}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h3>¡Tu pedido se ha realizado con éxito!</h3>

        {mostrarAviso && (
          <p className="pago-aviso">
            Por favor, si tu método de pago es diferente a <strong>efectivo</strong>, recuerda enviar el comprobante a <strong>3121234567</strong>.
          </p>
        )}

        <button onClick={onClose} className="btn-cerrar">
          Entendido
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
