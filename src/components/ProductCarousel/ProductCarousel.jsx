import React from 'react';
import Slider from 'react-slick';
import ProductCard from '../ProductCard/ProductCard';
import '../ProductCarousel/ProductCarousel.css';

const ProductCarousel = ({ productos = [], title = "Productos", className = "" }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 }},
      { breakpoint: 768, settings: { slidesToShow: 2 }},
      { breakpoint: 480, settings: { slidesToShow: 1 }}
    ]
  };

  return (
    <div className={`carousel-section ${className}`}>
      <h2>{title}</h2>
      <Slider {...settings}>
        {productos.map(producto => (
          <ProductCard key={producto._id} producto={producto} />
        ))}
      </Slider>
    </div>
  );
};


export default ProductCarousel;
