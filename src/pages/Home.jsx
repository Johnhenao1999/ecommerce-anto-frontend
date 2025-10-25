import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import PromoStrip from '../components/PromoStrip/PromoStrip';
import ProductCarousel from '../components/ProductCarousel/ProductCarousel';
import Newsletter from '../components/Newsletter/Newsletter';
import Footer from '../components/Footer/Footer';
import '../styles/home.css';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import FullScreenLoader from '../components/Loader/FullScreenLoader';

const Home = () => {
  const { productos, loading } = useProducts();
  const [latestProducts, setLatestProducts] = useState([]);
  const [cheapestProducts, setCheapestProducts] = useState([]);

  useEffect(() => {
    if (productos.length) {
      const productosOrdenadosPorFecha = [...productos].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLatestProducts(productosOrdenadosPorFecha.slice(0, 8));

      const productosOrdenadosPorPrecio = [...productos].sort(
        (a, b) => a.precio - b.precio
      );
      setCheapestProducts(productosOrdenadosPorPrecio.slice(0, 8));
    }
  }, [productos]);

  if (loading) return <FullScreenLoader message="Cargando productos..." />;

  return (
    <>
      <Header />
      <Hero />
      <main>
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

        <Footer />
      </main>
    </>
  );
};

export default Home;
