import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartPanel.css';

const CartPanel = ({ visible, onClose }) => {
  const { cartItems, incrementarCantidad, disminuirCantidad, eliminarDelCarrito } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const enviarOrdenPorWhatsApp = () => {
    const mensaje = cartItems.map(item =>
      `🛍️ ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`
    ).join('\n');

    const totalTexto = `\n💰 Total: $${total.toFixed(2)}`;
    const textoFinal = `Hola, quiero realizar esta orden:\n\n${mensaje}${totalTexto}\n\n📲 Métodos de pago:\n- Nequi: 3121234567\n- Daviplata: 3131234567\nEnvía el comprobante después del pago.`;


    const numero = '34611273164'; // sin "+" ni espacios
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(textoFinal)}`;

    window.open(url, '_blank');
  };

  return (
    <>
      {visible && <div className="cart-backdrop" onClick={onClose}></div>}

      <div className={`cart-panel ${visible ? 'visible' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#d63384" viewBox="0 0 16 16">
              <path d="M0 1a.5.5 0 0 1 .5-.5H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.402L2.01 2H.5a.5.5 0 0 1-.5-.5ZM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm7 1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
            </svg>
            <h2>Mi carrito</h2>
          </div>
          <button className="close-btn" onClick={onClose} title="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#999" viewBox="0 0 16 16">
              <path d="M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p>No hay productos.</p>
        ) : (
          <>
            <div className='cart-panel-content'>
              <div className="cart-body">
                <ul className="cart-list">
                  {cartItems.map(item => (
                    <li key={item.id} className="cart-item">
                      <div className="item-header">
                        <img src={item.imagen} width={100} alt={item.nombre} />
                        <strong>{item.nombre}</strong>
                        <button className="delete-btn" onClick={() => eliminarDelCarrito(item.id)} title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Zm2.5-.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Z" />
                            <path fillRule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H5V1.5A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5V2h2.5a1 1 0 0 1 1 1ZM6 2v-.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V2H6Z" />
                          </svg>
                        </button>
                      </div>

                      <div className="item-controls">
                        <button onClick={() => disminuirCantidad(item.id)} className="qty-btn">−</button>
                        <input type="number" min="1" value={item.cantidad} readOnly />
                        <button onClick={() => incrementarCantidad(item.id)} className="qty-btn">+</button>
                      </div>

                      <div className="item-pricing">
                        <span>Precio: ${item.precio.toFixed(2)}</span>
                        <span>Subtotal: ${(item.precio * item.cantidad).toFixed(2)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cart-footer">
                <hr />
                <h3>Total: ${total.toFixed(2)}</h3>
                <div className="cart-actions">
                  <button className="btn-order" onClick={enviarOrdenPorWhatsApp}>
                    Realizar orden
                  </button>
                  <button className="btn-secondary" onClick={onClose}>
                    Seguir comprando
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPanel;
