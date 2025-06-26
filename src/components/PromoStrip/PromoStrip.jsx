import React from 'react';
import './PromoStrip.css';
import LogoAme from '../../assets/Logo-Marca-ame-cosmetics.webp';
import logoAtenea from '../../assets/Logo-Marca-atenea-productos-de-belleza (1).webp';
import LogoLoreal from '../../assets/Logo-Marca-loreal-maquillaje.webp';
import LogoMontoc from '../../assets/Logo-Marca-Montoc-Cosmetics.webp';
import LogoMostBeauty from '../../assets/Logo-Marca-mb-mostbeauty-maquillaje (1).webp';


const promoText = 'SALE 20% — NUEVA COLECCIÓN';
const repeatCount = 6;

const PromoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="promo-icon"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const PromoStrip = () => {
  return (
    <div className="promo-strip">
      <div className="promo-strip__inner">
        {[...Array(2)].map((_, i) => (
          <div className="promo-strip__content" key={i} aria-hidden={i === 1}>
            {[...Array(repeatCount)].map((_, j) => (
              <React.Fragment key={j}>
                { /* Render the promo icon and text
                <span className="promo-item">
                  <PromoIcon />
                  {promoText}
                </span>
                */}
                <img
                  src={LogoAme}
                  alt="Logo Ame"
                  className="promo-logo"
                />
                <img
                  src={logoAtenea}
                  alt="Logo Atenea"
                  className="promo-logo"
                />
                <img
                  src={LogoLoreal}
                  alt="Logo Loreal"
                  className="promo-logo"
                />
                <img
                  src={LogoMontoc}
                  alt="Logo Montoc"
                  className="promo-logo"
                />
                <img
                  src={LogoMostBeauty}
                  alt="Logo Most Beauty"
                  className="promo-logo"
                />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};


export default PromoStrip;
