import axios from 'axios';
import { API_BASE } from '../utils/api';

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
