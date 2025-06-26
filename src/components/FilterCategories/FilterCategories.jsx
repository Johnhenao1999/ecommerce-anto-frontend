import React from 'react';
import './FilterCategories.css';

const FiltrosSubcategorias = ({ subcategorias, subcategoriaActiva, setSubcategoriaActiva }) => {
    if (!subcategorias || subcategorias.length === 0) {
        return <p>No hay subcategorías</p>;
    }

    return (
        <aside className="filtros">
            <h3>Categorias</h3>
            <ul>
                <li
                    className={!subcategoriaActiva ? 'active' : ''}
                    onClick={() => setSubcategoriaActiva(null)}
                >
                    Todas
                </li>
                {subcategorias.map((sub) => (
                    <li
                        key={sub.slug}
                        className={sub.slug === subcategoriaActiva ? 'active' : ''}
                        onClick={() => setSubcategoriaActiva(sub.slug)}
                    >
                        {sub.nombre}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default FiltrosSubcategorias;
