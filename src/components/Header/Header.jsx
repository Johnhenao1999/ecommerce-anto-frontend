import React, { useState, useEffect } from 'react';
import './header.css';  
import logo from '../../assets/logo-anto-store.jpeg';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { obtenerCategorias } from '../../services/categoriasService'; // Asegurate de que este archivo exista

const Header = () => {
  const { cantidadTotal, setMostrarCarrito } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        setCategorias(data);
      } catch (err) {
        console.error('No se pudieron cargar las categorías');
      }
    };

    fetchCategorias();
  }, []);

  return (
    <>
      <header className="app-header">
        <div className="pre-header">
          Realiza tu pedido por medio del sitio web y obtendrás beneficios.
        </div>

        <div className='app-header-container section'>
          <button
            className="hamburger-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="header-left">
            <Link to="/"> <img className="logo" src={logo} alt="Anto Store Logo" /></Link>
          </div>

          <div className="search-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px'
            }}>
              <input
                type="text"
                placeholder="¿Qué estás buscando hoy?"
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 16px',
                  borderRadius: '24px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  outline: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-search"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          <div className="user-menu">
            <div className='hidden-mobile-redes'>
              {/* Instagram */}
              <a href="https://www.instagram.com/anto_store29">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon-instagram" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                </svg>
              </a>

              {/* TikTok */}
              <a href="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="30" height="30" className="icon-tiktok">
                  <path fill="currentColor" d="M208 84.5a60.6 60.6 0 0 1-38.2-13.5V144a64 64 0 1 1-64-64 62.4 62.4 0 0 1 8 .5v40.7a24 24 0 1 0 16 22.8V16h40.2a60.2 60.2 0 0 0 41.8 59Z" />
                </svg>
              </a>

            </div>
            {/* Carrito */}
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setMostrarCarrito(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-bag" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {cantidadTotal > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#E86B84',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '12px'
                }}>
                  {cantidadTotal}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='header-container-category' style={{ width: '100%' }}>
          <div className='header-category section'>
            {categorias.map((cat) => (
              <Link key={cat._id} to={`/categoria/${cat.slug}`}>
                {cat.nombre}
              </Link>
            ))}
          </div>
        </div>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div className="menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>

            {/* Menú lateral */}
            <div className={`mobile-menu open`}>
              <button className="close-menu" onClick={() => setIsMenuOpen(false)}>✕</button>

              <div className="mobile-categories">
                <Link onClick={() => setIsMenuOpen(false)} key={cat._id} to={`/categoria/${cat.slug}`}>
                  {cat.nombre}
                </Link>
              </div>

              <div className="mobile-socials">
                {/* Instagram */}
                <a href="https://www.instagram.com/anto_store29">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon-instagram" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                  </svg>
                </a>

                {/* TikTok */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="30" height="30" className="icon-tiktok">
                  <path fill="currentColor" d="M208 84.5a60.6 60.6 0 0 1-38.2-13.5V144a64 64 0 1 1-64-64 62.4 62.4 0 0 1 8 .5v40.7a24 24 0 1 0 16 22.8V16h40.2a60.2 60.2 0 0 0 41.8 59Z" />
                </svg>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Header;