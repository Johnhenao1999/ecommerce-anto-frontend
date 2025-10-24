import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth >= 768) {
      setIsOpen(true); // En escritorio, sidebar siempre abierto
    }
  };

  useEffect(() => {
    handleResize(); // Inicializar correctamente
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón hamburguesa en móvil */}
      {isMobile && (
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      {/* Overlay en móvil */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay show" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobile && isOpen ? 'open' : ''}`}>
        {/* Botón cerrar solo en móvil */}
        {isMobile && (
          <button className="close-sidebar" onClick={toggleSidebar}>
            ✕
          </button>
        )}
        <div className="sidebar-logo">Bienvenido</div>
        <ul className="sidebar-links">
          <li onClick={() => navigate('/admin/list-products')}>Productos</li>
          <li onClick={() => navigate('/admin/categorias')}>Categorías</li>
          <li onClick={() => navigate('/admin/ordenes')}>Órdenes</li>
          <li onClick={() => navigate('/admin/agregar-productos')}>Agregar Productos</li>
          <li onClick={cerrarSesion}>Cerrar sesión</li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
