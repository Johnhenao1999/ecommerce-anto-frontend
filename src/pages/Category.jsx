import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import FiltrosSubcategorias from '../components/FilterCategories/FilterCategories';
import ProductCard from '../components/ProductCard/ProductCard';
import Footer from '../components/Footer/Footer';
import '../styles/category.css';
import { obtenerProducts } from '../services/categoriasService';

const Categoria = () => {
  const { categoriaSlug } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [subcategoriaActiva, setSubcategoriaActiva] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(8);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { categorias } = await obtenerProducts();
        const encontrada = categorias.find(cat => cat.slug === categoriaSlug);
        setCategoria(encontrada);
        setPaginaActual(1);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    cargarDatos();
  }, [categoriaSlug]);

  // 👇 Ajustar productos por página según ancho
  useEffect(() => {
    const actualizarProductosPorPagina = () => {
      const width = window.innerWidth;

      if (width <= 768) {
        setProductosPorPagina(8); // 🔹 siempre 8 productos en mobile
      } else if (width <= 1200) {
        setProductosPorPagina(6); // 2 filas x 3 columnas en tablet
      } else {
        setProductosPorPagina(8); // 2 filas x 4 columnas en desktop
      }
    };

    actualizarProductosPorPagina();
    window.addEventListener('resize', actualizarProductosPorPagina);
    return () => window.removeEventListener('resize', actualizarProductosPorPagina);
  }, []);

  if (!categoria) return <p>Categoría no encontrada</p>;

  const subcategorias = categoria.subcategorias || [];
  let productos = [];

  if (subcategoriaActiva) {
    const sub = subcategorias.find(s => s.slug === subcategoriaActiva);
    productos = sub?.productos || [];
  } else {
    const productosCategoria = categoria.productos || [];
    const productosSubcategorias = subcategorias.flatMap(sub => sub.productos || []);
    productos = [...productosCategoria, ...productosSubcategorias];
  }

  // 🔹 Paginación
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);
  const indiceInicial = (paginaActual - 1) * productosPorPagina;
  const productosPaginados = productos.slice(indiceInicial, indiceInicial + productosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      <main className="categoria-main">
        <FiltrosSubcategorias
          subcategorias={subcategorias}
          subcategoriaActiva={subcategoriaActiva}
          setSubcategoriaActiva={(sub) => {
            setSubcategoriaActiva(sub);
            setPaginaActual(1);
          }}
        />

        <section className="categoria-productos">
          <h1>{categoria.nombre}</h1>
          {subcategoriaActiva && (
            <h2 className="categoria-filtrado">
              {subcategorias.find(s => s.slug === subcategoriaActiva)?.nombre}
            </h2>
          )}

          <div className="productos-grid">
            {productosPaginados.length > 0 ? (
              productosPaginados.map((producto) => (
                <ProductCard key={producto._id} producto={producto} />
              ))
            ) : (
              <p>No hay productos en esta subcategoría.</p>
            )}
          </div>

          {/* 🔹 Paginador */}
          {totalPaginas > 1 && (
            <div className="paginador">
              <button
                className="paginador-btn"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                ←
              </button>

              <div className="paginador-numeros">
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`paginador-num ${paginaActual === i + 1 ? 'activo' : ''}`}
                    onClick={() => cambiarPagina(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="paginador-btn"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                →
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Categoria;
