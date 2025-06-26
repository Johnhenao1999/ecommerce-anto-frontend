import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../utils/data.json';
import Header from '../components/Header/Header';
import FiltrosSubcategorias from '../components/FilterCategories/FilterCategories';
import ProductCard from '../components/ProductCard/ProductCard';
import Footer from '../components/Footer/Footer';
import '../styles/category.css';

const Categoria = () => {
  const { categoriaSlug } = useParams();
  const categoria = data.categorias.find(cat => cat.slug === categoriaSlug);

  const [subcategoriaActiva, setSubcategoriaActiva] = useState(null);

  if (!categoria) return <p>Categoría no encontrada</p>;

  const subcategorias = categoria.subcategorias || [];

  let productos = [];

  if (subcategoriaActiva) {
    const sub = subcategorias.find(s => s.slug === subcategoriaActiva);
    productos = sub?.productos || [];
  } else if (categoria.productos) {
    productos = categoria.productos;
  } else {
    productos = subcategorias.flatMap(sub => sub.productos);
  }

  return (
    <>
      <Header />
      <main className="categoria-main">
        <FiltrosSubcategorias
          subcategorias={subcategorias}
          subcategoriaActiva={subcategoriaActiva}
          setSubcategoriaActiva={setSubcategoriaActiva}
        />

        <section className="categoria-productos">
          <h1>{categoria.nombre}</h1>
          {subcategoriaActiva && (
            <h2 className="categoria-filtrado">
              {subcategorias.find(s => s.slug === subcategoriaActiva)?.nombre}
            </h2>
          )}

          <div className="productos-grid">
            {productos.length > 0 ? (
              productos.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
              ))
            ) : (
              <p>No hay productos en esta subcategoría.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Categoria;
