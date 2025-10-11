import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import PromoStrip from '../components/PromoStrip/PromoStrip';
import ProductCarousel from '../components/ProductCarousel/ProductCarousel';
import Newsletter from '../components/Newsletter/Newsletter';
import Footer from '../components/Footer/Footer';
import '../styles/home.css';
import { motion } from 'framer-motion';
import { obtenerProducts } from '../services/categoriasService';

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [cheapestProducts, setCheapestProducts] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const { categorias } = await obtenerProducts();
        console.log('Categorías obtenidas:', categorias);

        // Combinar productos de categorías y subcategorías
        const productos = categorias.flatMap(cat => {
          const productosCategoria = cat.productos || [];
          const productosSubcategorias = cat.subcategorias?.flatMap(sub => sub.productos) || [];
          return [...productosCategoria, ...productosSubcategorias];
        });

        // 🔹 Ordenar por fecha de creación (más nuevos primero)
        const productosOrdenadosPorFecha = [...productos].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // 🔹 Tomar los 8 más nuevos
        const ultimos8 = productosOrdenadosPorFecha.slice(0, 8);

        // 🔹 Ordenar por precio (más baratos primero)
        const productosOrdenadosPorPrecio = [...productos].sort((a, b) => a.precio - b.precio);

        // 🔹 Tomar los 8 más baratos
        const masBaratos8 = productosOrdenadosPorPrecio.slice(0, 8);

        setAllProducts(productos);
        setLatestProducts(ultimos8);
        setCheapestProducts(masBaratos8);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    cargarProductos();
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <main>
        {/* 🔹 Carrusel de los más baratos */}
        <motion.section
          className="section-destacados"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <ProductCarousel
            productos={cheapestProducts}
            title="RECOMENDADOS PARA TI"
            className="mas-vendidos-carousel section"
          />
        </motion.section>

        <PromoStrip />

        {/* 🔹 Carrusel de productos nuevos */}
        <motion.section
          className="section-destacados"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <ProductCarousel
            productos={latestProducts}
            title="PRODUCTOS NUEVOS"
            className="mas-vendidos-carousel section"
          />
        </motion.section>

        {/* <Newsletter /> */}

        <Footer />
      </main>
    </>
  );
};

export default Home;
