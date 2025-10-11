import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import ProductCard from '../ProductCard/ProductCard';
import '../ProductCarousel/ProductCarousel.css';

const ProductCarousel = ({ productos = [], title = "Productos", className = "" }) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    // ⚙️ Recalcular carrusel después del render y animaciones iniciales
    const forceUpdate = () => {
      window.dispatchEvent(new Event('resize'));
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(0, true);
      }
    };

    // Doble verificación (para framer-motion o renders diferidos)
    setTimeout(forceUpdate, 400);
    setTimeout(forceUpdate, 1000);
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    adaptiveHeight: true,
    lazyLoad: 'ondemand',
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className={`carousel-section ${className}`}>
      <h2>{title}</h2>
      <Slider ref={sliderRef} {...settings}>
        {productos.map((producto) => (
          <ProductCard key={producto._id} producto={producto} />
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
