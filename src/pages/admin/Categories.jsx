import React, { useEffect, useState } from "react";
import "../../styles/categoryAdminPanel.css";
import Navbar from "../../components/Navbar/Navbar";
import { API_BASE } from "../../utils/api";

const Categories = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [subEditando, setSubEditando] = useState(null);
  const [nuevasSubs, setNuevasSubs] = useState({}); // 🔹 un objeto por categoría

  // Obtener categorías
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

  // Editar categoría o subcategoría
  const handleGuardar = async (item, isSub = false, idCat) => {
    try {
      const endpoint = `${API_BASE}/categories/${isSub ? `sub/${idCat}/${item._id}` : item._id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: item.nombre }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      // 🔹 Actualizar el estado local sin recargar
      if (isSub) {
        setCategorias((prev) =>
          prev.map((cat) =>
            cat._id === idCat
              ? {
                  ...cat,
                  subcategorias: cat.subcategorias.map((s) =>
                    s._id === item._id ? { ...s, nombre: item.nombre } : s
                  ),
                }
              : cat
          )
        );
        setSubEditando(null);
      } else {
        setCategorias((prev) =>
          prev.map((cat) =>
            cat._id === item._id ? { ...cat, nombre: item.nombre } : cat
          )
        );
        setCategoriaEditando(null);
      }

      alert("✅ Cambios guardados correctamente");
    } catch (err) {
      console.error("❌ Error al guardar:", err);
    }
  };

  // Agregar subcategoría (por categoría)
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

      // 🔹 Actualizar la categoría correspondiente sin recargar
      setCategorias((prev) =>
        prev.map((cat) =>
          cat._id === idCat
            ? { ...cat, subcategorias: data.subcategorias }
            : cat
        )
      );

      // Limpia solo el input de esa categoría
      setNuevasSubs((prev) => ({ ...prev, [idCat]: "" }));

      alert("✅ Subcategoría agregada");
    } catch (err) {
      console.error("❌ Error al agregar subcategoría:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="categories section-admin">
        <h2>Categorías y Subcategorías</h2>

        <table>
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Subcategorías</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat._id}>
                <td>
                  {categoriaEditando === cat._id ? (
                    <input
                      type="text"
                      value={cat.nombre}
                      onChange={(e) =>
                        setCategorias((prev) =>
                          prev.map((c) =>
                            c._id === cat._id
                              ? { ...c, nombre: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    cat.nombre
                  )}
                </td>

                <td>
                  {cat.subcategorias.length > 0 ? (
                    <ul>
                      {cat.subcategorias.map((sub) => (
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
                                          subcategorias: c.subcategorias.map(
                                            (s) =>
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
                            sub.nombre
                          )}
                          <button
                            onClick={() =>
                              subEditando === sub._id
                                ? handleGuardar(sub, true, cat._id)
                                : setSubEditando(sub._id)
                            }
                            className="edit-btn"
                          >
                            {subEditando === sub._id ? "💾" : "✏️"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-sub">Sin subcategorías</p>
                  )}

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
                    <button onClick={() => handleAgregarSub(cat._id)}>➕</button>
                  </div>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      categoriaEditando === cat._id
                        ? handleGuardar(cat)
                        : setCategoriaEditando(cat._id)
                    }
                  >
                    {categoriaEditando === cat._id ? "💾" : "✏️"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Categories;
