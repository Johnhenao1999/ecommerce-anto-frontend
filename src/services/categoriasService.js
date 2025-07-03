// src/services/categoriasService.js
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api'; // cambia si tu backend está en producción

export const obtenerCategorias = async () => {
  try {
    const response = await axios.get(`${API_BASE}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

export const obtenerProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/products`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};
