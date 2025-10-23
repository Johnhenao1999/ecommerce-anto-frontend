import React, { useState } from "react";
import "../../styles/AddCategory.css";
import Navbar from "../../components/Navbar/Navbar";
import { API_BASE } from "../../utils/api";

const CrearCategoria = () => {
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [subcategorias, setSubcategorias] = useState([""]);
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState(null); // "success" | "error" | null

  const agregarSubcategoria = () => {
    setSubcategorias([...subcategorias, ""]);
  };

  const actualizarSubcategoria = (index, value) => {
    const nuevas = [...subcategorias];
    nuevas[index] = value;
    setSubcategorias(nuevas);
  };

  const eliminarSubcategoria = (index) => {
    const nuevas = subcategorias.filter((_, i) => i !== index);
    setSubcategorias(nuevas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreCategoria.trim()) {
      setMensaje("⚠️ El nombre de la categoría es obligatorio.");
      setEstado("error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreCategoria.trim(),
          subcategorias: subcategorias
            .map((sub) => sub.trim())
            .filter((sub) => sub !== ""),
        }),
      });

      if (!res.ok) throw new Error("Error en la creación");

      const data = await res.json();
      setMensaje(`✅ Categoría "${data.categoria.nombre}" creada con éxito.`);
      setEstado("success");
      setNombreCategoria("");
      setSubcategorias([""]);
    } catch (err) {
      console.error("Error al crear categoría:", err);
      setMensaje("❌ Error al crear la categoría.");
      setEstado("error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="crear-categoria section-admin">
        <h2>Crear Nueva Categoría</h2>

        {mensaje && (
          <div className={`mensaje ${estado}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="categoria-form">
          {/* Campo principal */}
          <label htmlFor="nombreCategoria">Nombre de la categoría</label>
          <input
            id="nombreCategoria"
            type="text"
            placeholder="Ej. Maquillaje, Cuidado facial..."
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
          />

          {/* Subcategorías */}
          <h4>Subcategorías</h4>
          <div className="subcategorias-container">
            {subcategorias.map((sub, i) => (
              <div key={i} className="subcategoria-item">
                <input
                  type="text"
                  placeholder={`Subcategoría ${i + 1}`}
                  value={sub}
                  onChange={(e) =>
                    actualizarSubcategoria(i, e.target.value)
                  }
                />
                {subcategorias.length > 1 && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => eliminarSubcategoria(i)}
                    title="Eliminar subcategoría"
                  >
                    {/* 🗑️ */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="16"
                      height="16"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Botón para agregar subcategoría */}
          <button
            type="button"
            className="add-sub-btn"
            onClick={agregarSubcategoria}
          >
            {/* ➕ */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Agregar Subcategoría</span>
          </button>

          <hr />

          {/* Botón de guardar */}
          <button type="submit" className="save-btn">
            {/* 💾 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
            >
              <path d="M20 21V8l-3-3H4a2 2 0 0 0-2 2v14h18z" />
              <polyline points="16 3 16 8 8 8 8 3" />
              <rect x="8" y="13" width="8" height="5" rx="1" />
            </svg>
            <span>Guardar Categoría</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default CrearCategoria;
