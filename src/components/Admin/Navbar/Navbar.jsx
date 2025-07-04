import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    console.log('Cerrando sesión...');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Bienvenido</div>
      <ul className="sidebar-links">
        <li onClick={() => navigate('/admin/agregar-productos')}>Agregar Productos</li>
        <li onClick={() => navigate('/admin/create-category')}>Agregar Categorías</li>
        <li onClick={() => navigate('/admin/list-products')}>Ver Productos</li>
        <li onClick={cerrarSesion}>Cerrar sesión</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
