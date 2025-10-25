import React, { createContext, useContext, useEffect, useState } from "react";
import { obtenerCategorias } from "../services/categoriasService";

const CategoryContext = createContext();

export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [state, setState] = useState({
    categorias: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        setState({
          categorias: data,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("❌ Error al cargar categorías:", err);
        setState({
          categorias: [],
          loading: false,
          error: "No se pudieron cargar las categorías",
        });
      }
    };

    cargarCategorias();
  }, []);

  return (
    <CategoryContext.Provider value={state}>
      {children}
    </CategoryContext.Provider>
  );
};
