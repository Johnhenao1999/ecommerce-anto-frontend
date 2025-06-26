import React from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import PromoStrip from '../components/PromoStrip/PromoStrip';
import data from '../utils/data.json';
import ProductCarousel from '../components/ProductCarousel/ProductCarousel';
import Newsletter from '../components/Newsletter/Newsletter';
import Footer from '../components/Footer/Footer';
import '../styles/home.css';
import { motion } from 'framer-motion';

const Home = () => {
  const allProducts = data.categorias.flatMap(cat =>
    cat.productos || cat.subcategorias?.flatMap(sub => sub.productos) || []
  );

  return (
    <>
      <Header />
      <Hero />
      <main>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <ProductCarousel
            productos={allProducts}
            title="MÁS VENDIDOS"
            className="mas-vendidos-carousel section"
          />
        </motion.div>
        <PromoStrip />
        <motion.div
          className='section-destacados'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <ProductCarousel
            productos={allProducts}
            title="PRODUCTOS DESTACADOS"
            className="mas-vendidos-carousel section"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Newsletter />
        </motion.div>

        <Footer />
      </main>
    </>
  );
};

export default Home;
