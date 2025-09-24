import React from 'react';
import './Hero.css';
import bannerImg from '../../assets/banner-anto.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-section">
      <motion.div 
        className='hero-section-container'
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.div 
          className='container-text-hero'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <h2> Descubre Tu <span>Belleza Natural</span></h2>
          <p>
            Para la mujer que convierte el cuidado personal en arte, y cada rutina en un momento de expresión, belleza y equilibrio
          </p>
          <Link className='button' to="/">Comprar ahora</Link>
        </motion.div>

        <motion.div 
          className='container-img-hero'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <img src={bannerImg} alt="Banner nueva colección" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
