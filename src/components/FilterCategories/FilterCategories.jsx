import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './FilterCategories.css';

const FiltrosSubcategorias = ({ subcategorias, subcategoriaActiva, setSubcategoriaActiva }) => {
  const navigate = useNavigate();
  const { categoriaSlug } = useParams();

  if (!subcategorias || subcategorias.length === 0) {
    return null;
  }

  const handleClick = (sub) => {
    // 🔹 Actualiza estado local
    setSubcategoriaActiva(sub);

    // 🔹 Actualiza la URL según la selección
    if (sub) {
      navigate(`/categoria/${categoriaSlug}/${sub}`);
    } else {
      navigate(`/categoria/${categoriaSlug}`);
    }

    // 🔹 Scroll al inicio después del cambio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="filtros">
      <h3>Categorías</h3>
      <ul>
        <li
          className={!subcategoriaActiva ? 'active' : ''}
          onClick={() => handleClick(null)}
        >
          Todas
        </li>

        {subcategorias.map((sub) => (
          <li
            key={sub.slug}
            className={sub.slug === subcategoriaActiva ? 'active' : ''}
            onClick={() => handleClick(sub.slug)}
          >
            {sub.nombre}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default FiltrosSubcategorias;
