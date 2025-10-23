import React, { useEffect, useState } from "react";
import "../../styles/categoryAdminPanel.css";
import Navbar from "../../components/Navbar/Navbar";
import { API_BASE } from "../../utils/api";

const Categories = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [subEditando, setSubEditando] = useState(null);
  const [nuevasSubs, setNuevasSubs] = useState({});
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error("❌ Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  const handleGuardar = async (item, isSub = false, idCat) => {
    try {
      const endpoint = `${API_BASE}/categories/${isSub ? `sub/${idCat}/${item._id}` : item._id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: item.nombre }),
      });
      if (!res.ok) throw new Error("Error al actualizar");

      setCategorias((prev) =>
        prev.map((cat) =>
          cat._id === (isSub ? idCat : item._id)
            ? {
              ...cat,
              nombre: isSub ? cat.nombre : item.nombre,
              subcategorias: isSub
                ? cat.subcategorias.map((s) =>
                  s._id === item._id ? { ...s, nombre: item.nombre } : s
                )
                : cat.subcategorias,
            }
            : cat
        )
      );

      setSubEditando(null);
      setCategoriaEditando(null);
      alert("✅ Cambios guardados correctamente");
    } catch (err) {
      console.error("❌ Error al guardar:", err);
    }
  };

  const handleAgregarSub = async (idCat) => {
    const nombre = (nuevasSubs[idCat] || "").trim();
    if (!nombre) return alert("Ingrese un nombre válido");

    try {
      const res = await fetch(`${API_BASE}/categories/${idCat}/sub`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error("Error al agregar subcategoría");

      const data = await res.json();
      setCategorias((prev) =>
        prev.map((cat) =>
          cat._id === idCat ? { ...cat, subcategorias: data.subcategorias } : cat
        )
      );
      setNuevasSubs((prev) => ({ ...prev, [idCat]: "" }));
    } catch (err) {
      console.error("❌ Error al agregar subcategoría:", err);
    }
  };

  const handleEliminarCategoria = async (idCat) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${idCat}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar categoría");
      setCategorias((prev) => prev.filter((cat) => cat._id !== idCat));
    } catch (err) {
      console.error("❌ Error al eliminar categoría:", err);
    }
  };

  const handleEliminarSubcategoria = async (idCat, idSub) => {
    if (!window.confirm("¿Eliminar esta subcategoría?")) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${idCat}/sub/${idSub}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar subcategoría");
      setCategorias((prev) =>
        prev.map((cat) =>
          cat._id === idCat
            ? { ...cat, subcategorias: cat.subcategorias.filter((s) => s._id !== idSub) }
            : cat
        )
      );
    } catch (err) {
      console.error("❌ Error al eliminar subcategoría:", err);
    }
  };

  const handleCrearCategoria = async () => {
    if (!nuevaCategoria.trim()) return alert("Ingrese un nombre válido");
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevaCategoria }),
      });
      if (!res.ok) throw new Error("Error al crear categoría");
      const data = await res.json();
      setCategorias((prev) => [...prev, data.categoria]);
      setNuevaCategoria("");
    } catch (err) {
      console.error("❌ Error al crear categoría:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="categories section-admin">
        <h2>Categorías y Subcategorías</h2>

        {/* 🔹 Lista de categorías */}
        <div className="category-list">
          {categorias.map((cat) => (
            <div className="category-card" key={cat._id}>
              <div className="category-header">
                {categoriaEditando === cat._id ? (
                  <input
                    type="text"
                    value={cat.nombre}
                    onChange={(e) =>
                      setCategorias((prev) =>
                        prev.map((c) =>
                          c._id === cat._id ? { ...c, nombre: e.target.value } : c
                        )
                      )
                    }
                  />
                ) : (
                  <h3>{cat.nombre}</h3>
                )}
                <div className="cat-actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      categoriaEditando === cat._id
                        ? handleGuardar(cat)
                        : setCategoriaEditando(cat._id)
                    }
                  >
                    {categoriaEditando === cat._id ? (
                      // 💾 Guardar
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        width="16" height="16">
                        <path d="M20 21V8l-3-3H4a2 2 0 0 0-2 2v14h18z" />
                        <polyline points="16 3 16 8 8 8 8 3" />
                        <rect x="8" y="13" width="8" height="5" rx="1" />
                      </svg>
                    ) : (
                      // ✏️ Editar
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        width="16" height="16">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    )}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleEliminarCategoria(cat._id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              </div>

              <ul className="subcategory-list">
                {cat.subcategorias.length > 0 ? (
                  cat.subcategorias.map((sub) => (
                    <li key={sub._id}>
                      {subEditando === sub._id ? (
                        <input
                          type="text"
                          value={sub.nombre}
                          onChange={(e) =>
                            setCategorias((prev) =>
                              prev.map((c) =>
                                c._id === cat._id
                                  ? {
                                    ...c,
                                    subcategorias: c.subcategorias.map((s) =>
                                      s._id === sub._id
                                        ? { ...s, nombre: e.target.value }
                                        : s
                                    ),
                                  }
                                  : c
                              )
                            )
                          }
                        />
                      ) : (
                        <span>{sub.nombre}</span>
                      )}
                      <div className="sub-actions">
                        <button
                          onClick={() =>
                            subEditando === sub._id
                              ? handleGuardar(sub, true, cat._id)
                              : setSubEditando(sub._id)
                          }
                          className="edit-btn"
                        >
                          {subEditando === sub._id ? (
                            // 💾 Guardar
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"
                              width="16" height="16">
                              <path d="M20 21V8l-3-3H4a2 2 0 0 0-2 2v14h18z" />
                              <polyline points="16 3 16 8 8 8 8 3" />
                              <rect x="8" y="13" width="8" height="5" rx="1" />
                            </svg>
                          ) : (
                            // ✏️ Editar
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"
                              width="16" height="16">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                          )}
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleEliminarSubcategoria(cat._id, sub._id)
                          }
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="no-sub">Sin subcategorías</p>
                )}
              </ul>

              {/* Agregar subcategoría */}
              <div className="add-sub">
                <input
                  type="text"
                  placeholder="Nueva subcategoría"
                  value={nuevasSubs[cat._id] || ""}
                  onChange={(e) =>
                    setNuevasSubs((prev) => ({
                      ...prev,
                      [cat._id]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => handleAgregarSub(cat._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
