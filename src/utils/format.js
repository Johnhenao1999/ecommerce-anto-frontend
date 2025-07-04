// utils/format.js

export const formatearCOP = (valor) => {
    if (isNaN(valor)) return '';
    return valor.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    });
  };
  