import React, { useState } from "react";
import "../../styles/ProductList.css";
import Navbar from "../../components/Navbar/Navbar";
import { formatearCOP } from "../../utils/format";
import { API_BASE } from "../../utils/api";
import { useProducts } from "../../context/ProductContext";
import { useCategories } from "../../context/CategoryContext";

const ProductList = () => {
  const { productos, refreshCache } = useProducts();
  const { categorias } = useCategories();
  const [filtro, setFiltro] = useState({ nombre: "", categoria: "", subcategoria: "" });
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina] = useState(8);
  const [productoEditando, setProductoEditando] = useState(null);
  const preset_name = "anto_store";
  const cloud_name = "djzdunsof";

  const categoriasData = categorias.reduce((acc, cat) => {
    acc[cat.nombre] = cat.subcategorias.map((s) => s.nombre);
    return acc;
  }, {});

  // 🧩 Productos aplanados (por seguridad)
  const productosAplanados = productos.map((p) => ({
    ...p,
    categoria:
      typeof p.categoria === "object" ? p.categoria?.nombre || "" : p.categoria || "",
    subcategoria:
      typeof p.subcategoria === "object"
        ? p.subcategoria?.nombre || ""
        : p.subcategoria || "",
  }));

  // 🔍 Filtrado
  const productosFiltrados = productosAplanados.filter((p) => {
    return (
      p.nombre.toLowerCase().includes(filtro.nombre.toLowerCase()) &&
      (filtro.categoria ? p.categoria === filtro.categoria : true) &&
      (filtro.subcategoria ? p.subcategoria === filtro.subcategoria : true)
    );
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const inicio = (paginaActual - 1) * productosPorPagina;
  const productosEnPagina = productosFiltrados.slice(inicio, inicio + productosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) setPaginaActual(nuevaPagina);
  };

  const categoriasList = Object.keys(categoriasData);
  const subcategoriasList = categoriasData[filtro.categoria] || [];

  // 🗑️ Eliminar producto + refrescar cache
  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este producto?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar producto");

      alert("✅ Producto eliminado correctamente");
      await refreshCache();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      alert("Hubo un error al eliminar el producto");
    }
  };

  // ✏️ Seleccionar producto (normalizado)
  const seleccionarProducto = (producto) => {
    const categoriaNombre =
      typeof producto.categoria === "object"
        ? producto.categoria?.nombre
        : producto.categoria;
    const subcategoriaNombre =
      typeof producto.subcategoria === "object"
        ? producto.subcategoria?.nombre
        : producto.subcategoria;

    // 🔹 Normalizamos la capitalización (primera letra mayúscula)
    const normalize = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    setProductoEditando({
      ...producto,
      categoria: normalize(categoriaNombre),
      subcategoria: normalize(subcategoriaNombre),
    });
  };

  // 💾 Editar producto + refrescar cache
  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/products/${productoEditando._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: productoEditando.nombre,
          marca: productoEditando.marca,
          precio: parseFloat(productoEditando.precio),
          imagen: productoEditando.imagen,
          categoria: productoEditando.categoria,
          subcategoria: productoEditando.subcategoria,
          tieneDescuento: !!productoEditando.tieneDescuento,
          porcentajeDescuento: productoEditando.tieneDescuento
            ? parseFloat(productoEditando.porcentajeDescuento)
            : 0,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar producto");

      alert("✅ Producto actualizado correctamente");
      setProductoEditando(null);
      await refreshCache();
    } catch (err) {
      console.error("❌ Error al editar producto:", err);
      alert("Hubo un problema al editar el producto");
    }
  };

  // ☁️ Subir imagen a Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset_name);
    form.append("cloud_name", cloud_name);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      setProductoEditando((prev) => ({
        ...prev,
        imagen: data.secure_url,
      }));
    } catch (err) {
      console.error("❌ Error al subir imagen:", err);
      alert("Error al subir imagen");
    }
  };

  return (
    <>
      <Navbar />
      <div className="product-list section-admin">
        <h2>Listado de Productos</h2>

        {/* 🔍 Filtros */}
        <div className="filters">
          <input
            type="text"
            placeholder="Buscar por nombre o marca"
            value={filtro.nombre}
            onChange={(e) => setFiltro((prev) => ({ ...prev, nombre: e.target.value }))}
          />

          <select
            value={filtro.categoria}
            onChange={(e) =>
              setFiltro((prev) => ({ ...prev, categoria: e.target.value, subcategoria: "" }))
            }
          >
            <option value="">Todas las categorías</option>
            {categoriasList.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filtro.subcategoria}
            onChange={(e) =>
              setFiltro((prev) => ({ ...prev, subcategoria: e.target.value }))
            }
            disabled={!filtro.categoria}
          >
            <option value="">Todas las subcategorías</option>
            {subcategoriasList.map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* 📋 Tabla */}
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Subcategoría</th>
              <th>Descuento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosEnPagina.map((p) => (
              <tr key={p._id}>
                <td>
                  <img src={p.imagen} alt={p.nombre} width="50" />
                </td>
                <td>{p.nombre}</td>
                <td>{p.marca}</td>
                <td>{formatearCOP(p.precio)}</td>
                <td>{p.categoria}</td>
                <td>{p.subcategoria}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {p.precioDescuento ? formatearCOP(p.precioDescuento) : "-"} /{" "}
                  {p.porcentajeDescuento || 0}%
                </td>
                <td style={{ display: "flex" }}>
                  <button className="edit-btn" onClick={() => seleccionarProducto(p)}>
                    ✏️
                  </button>
                  <button className="delete-btn" onClick={() => handleEliminar(p._id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ⏩ Paginación */}
        <div className="pagination">
          <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>

        {/* 🧱 Modal de edición */}
        {productoEditando && (
          <div className="modal">
            <div className="modal-content">
              <h3>Editar Producto</h3>
              <form onSubmit={handleEditar}>
                <input
                  type="text"
                  value={productoEditando.nombre}
                  onChange={(e) =>
                    setProductoEditando((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                  placeholder="Nombre"
                />

                <input
                  type="text"
                  value={productoEditando.marca}
                  onChange={(e) =>
                    setProductoEditando((prev) => ({ ...prev, marca: e.target.value }))
                  }
                  placeholder="Marca"
                />

                <input
                  type="number"
                  value={productoEditando.precio}
                  onChange={(e) =>
                    setProductoEditando((prev) => ({ ...prev, precio: e.target.value }))
                  }
                  placeholder="Precio"
                />

                {/* Descuento */}
                <div style={{ marginBottom: "10px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={productoEditando.tieneDescuento || false}
                      onChange={(e) =>
                        setProductoEditando((prev) => ({
                          ...prev,
                          tieneDescuento: e.target.checked,
                          porcentajeDescuento: e.target.checked
                            ? prev.porcentajeDescuento || 0
                            : "",
                        }))
                      }
                    />
                    ¿Tiene descuento?
                  </label>
                </div>

                {productoEditando.tieneDescuento && (
                  <div style={{ marginBottom: "10px" }}>
                    <label>Porcentaje de descuento (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={productoEditando.porcentajeDescuento || ""}
                      onChange={(e) =>
                        setProductoEditando((prev) => ({
                          ...prev,
                          porcentajeDescuento: e.target.value,
                        }))
                      }
                      placeholder="Porcentaje de descuento"
                    />
                    {productoEditando.precio && (
                      <small>
                        Precio final:{" "}
                        {formatearCOP(
                          productoEditando.precio -
                          (productoEditando.precio *
                            productoEditando.porcentajeDescuento) /
                          100
                        )}
                      </small>
                    )}
                  </div>
                )}

                {/* Imagen actual + input */}
                {productoEditando.imagen && (
                  <div style={{ marginBottom: "10px" }}>
                    <img
                      src={productoEditando.imagen}
                      alt="Vista previa"
                      style={{ width: "100px", borderRadius: "8px", marginBottom: "5px" }}
                    />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} />

                {/* Categoría */}
                <select
                  value={productoEditando.categoria}
                  onChange={(e) =>
                    setProductoEditando((prev) => ({
                      ...prev,
                      categoria: e.target.value,
                      subcategoria: "",
                    }))
                  }
                >
                  <option value="">Selecciona categoría</option>
                  {categoriasList.map((cat) => {
                    const normalizedCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
                    return (
                      <option key={normalizedCat} value={normalizedCat}>
                        {normalizedCat}
                      </option>
                    );
                  })}
                </select>

                <select
                  value={productoEditando.subcategoria}
                  onChange={(e) =>
                    setProductoEditando((prev) => ({
                      ...prev,
                      subcategoria: e.target.value,
                    }))
                  }
                  disabled={!productoEditando.categoria}
                >
                  <option value="">Selecciona subcategoría</option>
                  {(categoriasData[productoEditando.categoria] || []).map((sub) => {
                    const normalizedSub = sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase();
                    return (
                      <option key={normalizedSub} value={normalizedSub}>
                        {normalizedSub}
                      </option>
                    );
                  })}
                </select>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setProductoEditando(null)}>
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
