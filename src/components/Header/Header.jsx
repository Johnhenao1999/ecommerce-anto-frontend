import React, { useState } from "react";
import "./Header.css";
import logo from "../../assets/logo-anto-store.jpeg";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCategories } from "../../context/CategoryContext";

const Header = () => {
  const { cantidadTotal, setMostrarCarrito } = useCart();
  const { categorias, loading, error } = useCategories();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  return (
    <>
      <header className="app-header">
        <div className="pre-header">
          Realiza tu pedido por medio del sitio web y obtendrás beneficios.
        </div>

        <div className="app-header-container section">
          <button
            className="hamburger-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="header-left">
            <Link to="/">
              <img className="logo" src={logo} alt="Anto Store Logo" />
            </Link>
          </div>

          {/* 🔍 Buscador */}
          <div
            className="search-container"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <input
                type="text"
                placeholder="¿Qué estás buscando hoy?"
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 16px",
                  borderRadius: "24px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  outline: "none",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
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
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* 🛒 Carrito */}
          <div className="user-menu">
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => setMostrarCarrito(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-bag"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {cantidadTotal > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    backgroundColor: "#E86B84",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px",
                  }}
                >
                  {cantidadTotal}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 🔽 Categorías desktop */}
        <div className="header-container-category" style={{ width: "100%" }}>
          <div className="header-category section">
            {loading ? (
              <span>Cargando categorías...</span>
            ) : error ? (
              <span>{error}</span>
            ) : (
              categorias.map((cat) => (
                <Link key={cat._id} to={`/categoria/${cat.slug}`}>
                  {cat.nombre}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 🔹 Menú móvil */}
        {isMenuOpen && (
          <>
            <div
              className="menu-backdrop"
              onClick={() => setIsMenuOpen(false)}
            ></div>

            <div className="mobile-menu open">
              <button
                className="close-menu"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕
              </button>

              <div className="mobile-categories">
                {categorias.map((cat) => (
                  <div key={cat._id} className="mobile-category-item">
                    <button
                      className="category-toggle"
                      onClick={() =>
                        setCategoriaActiva(
                          categoriaActiva === cat._id ? null : cat._id
                        )
                      }
                    >
                      <span>{cat.nombre}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`arrow-icon ${
                          categoriaActiva === cat._id ? "open" : ""
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <div
                      className={`subcategory-list ${
                        categoriaActiva === cat._id ? "show" : ""
                      }`}
                    >
                      {cat.subcategorias?.map((sub) => (
                        <Link
                          key={sub._id}
                          to={`/categoria/${cat.slug}/${sub.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.nombre}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Header;
