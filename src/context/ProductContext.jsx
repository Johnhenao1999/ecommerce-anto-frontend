import { createContext, useContext, useEffect, useState } from "react";
import { obtenerProducts } from "../services/categoriasService";

const CACHE_KEY = "cache_productos_v1"; // 🔑 puedes versionarlo si cambias estructura
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 horas

const ProductContext = createContext();
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [state, setState] = useState({
    categorias: [],
    productos: [],
    loading: true,
    error: null, 
  });

  // 🔹 Función principal que carga productos (desde caché o API)
  const cargarProductos = async () => {
    try {
      // 🧠 1️⃣ Revisar si hay caché válido
      const cacheRaw = localStorage.getItem(CACHE_KEY);
      if (cacheRaw) {
        const cache = JSON.parse(cacheRaw);
        const isExpired = Date.now() - cache.timestamp > CACHE_TTL;

        if (!isExpired && cache.data?.productos?.length > 0) {
          console.log("✅ Productos cargados desde cache localStorage");
          setState({
            categorias: cache.data.categorias,
            productos: cache.data.productos,
            loading: false,
            error: null,
          });
          return;
        } else {
          console.log("⚠️ Caché expirado, obteniendo desde backend...");
          localStorage.removeItem(CACHE_KEY);
        }
      }

      // 🧩 2️⃣ Si no hay caché o expiró → llamar al backend
      const { categorias } = await obtenerProducts();

      // Combinar productos de categorías y subcategorías
      const productos = categorias.flatMap((cat) => [
        ...(cat.productos || []),
        ...(cat.subcategorias?.flatMap((sub) => sub.productos) || []),
      ]);

      const dataToCache = {
        categorias,
        productos,
      };

      // 💾 3️⃣ Guardar en localStorage con timestamp
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: dataToCache, timestamp: Date.now() })
      );

      console.log("⚡ Productos cargados desde backend y cacheados");

      setState({
        categorias,
        productos,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
      setState({
        categorias: [],
        productos: [],
        loading: false,
        error: "Error al cargar productos",
      });
    }
  };

  // 🔁 Permite refrescar manualmente (por ejemplo desde el admin)
  const refreshCache = async () => {
    console.log("🔄 Refrescando caché de productos...");
    localStorage.removeItem(CACHE_KEY);
    setState((prev) => ({ ...prev, loading: true }));
    await cargarProductos();
  };

  // 🚀 Cargar productos al montar el contexto
  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <ProductContext.Provider value={{ ...state, refreshCache }}>
      {children}
    </ProductContext.Provider>
  );
};
