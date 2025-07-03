import React, { useEffect, useState } from 'react';
import '../../styles/ProductList.css';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState({ nombre: '', categoria: '', subcategoria: '' });
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina] = useState(8);
  const [productoEditando, setProductoEditando] = useState(null);
  const preset_name = 'anto_store';
  const cloud_name = 'djzdunsof';

  const categoriasData = {
    maquillaje: ['Cejas', 'Labios', 'Shampoo'],
    Varios: ['Balones', 'Ropa', 'Otros'],
    Capilar: ['Shampoo', 'Acondicionador', 'Tratamientos'],
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();

        const productosAplanados = data.categorias.flatMap(categoria =>
          categoria.subcategorias.flatMap(subcategoria =>
            subcategoria.productos.map(producto => ({
              ...producto,
              categoria: categoria.nombre,
              subcategoria: subcategoria.nombre
            }))
          )
        );

        setProductos(productosAplanados);
      } catch (err) {
        console.error('❌ Error cargando productos:', err);
      }
    };
    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter((p) => {
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
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const categorias = [...new Set(productos.map(p => p.categoria))];
  const subcategorias = [...new Set(productos.filter(p => p.categoria === filtro.categoria).map(p => p.subcategoria))];

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar');

      setProductos(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('❌ Error al eliminar producto:', err);
      alert('Error al eliminar producto');
    }
  };

  const seleccionarProducto = (producto) => {
    setProductoEditando(producto);
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/products/${productoEditando._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoEditando),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      setProductos(prev => prev.map(p => (p._id === productoEditando._id ? productoEditando : p)));
      setProductoEditando(null);
    } catch (err) {
      console.error('❌ Error al editar:', err);
      alert('Hubo un problema al editar el producto');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset_name); // Tu preset en Cloudinary
    form.append('cloud_name', cloud_name); // Tu Cloudinary cloud name
  
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: 'POST',
        body: form
      });
  
      const data = await res.json();
  
      // Actualizar la imagen en el producto editando
      setProductoEditando(prev => ({
        ...prev,
        imagen: data.secure_url
      }));
    } catch (err) {
      console.error('❌ Error al subir imagen:', err);
      alert('Error al subir imagen');
    }
  };

  return (
    <div className="product-list">
      <h2>Listado de Productos</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre o marca"
          value={filtro.nombre}
          onChange={(e) => setFiltro(prev => ({ ...prev, nombre: e.target.value }))}
        />
        <select
          value={filtro.categoria}
          onChange={(e) => {
            setFiltro(prev => ({ ...prev, categoria: e.target.value, subcategoria: '' }));
            setPaginaActual(1);
          }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <select
          value={filtro.subcategoria}
          onChange={(e) => setFiltro(prev => ({ ...prev, subcategoria: e.target.value }))}
          disabled={!filtro.categoria}
        >
          <option value="">Todas las subcategorías</option>
          {subcategorias.map(sub => <option key={sub}>{sub}</option>)}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Subcategoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosEnPagina.map(p => (
            <tr key={p._id}>
              <td><img src={p.imagen} alt={p.nombre} width="50" /></td>
              <td>{p.nombre}</td>
              <td>{p.marca}</td>
              <td>${p.precio}</td>
              <td>{p.categoria}</td>
              <td>{p.subcategoria}</td>
              <td>{p.stock}</td>
              <td>
                <button className="edit-btn" onClick={() => seleccionarProducto(p)}>✏️</button>
                <button className="delete-btn" onClick={() => handleEliminar(p._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>Siguiente</button>
      </div>

      {productoEditando && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Producto</h3>
            <form onSubmit={handleEditar}>
              <input
                type="text"
                value={productoEditando.nombre}
                onChange={(e) => setProductoEditando(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre"
              />
              <input
                type="text"
                value={productoEditando.marca}
                onChange={(e) => setProductoEditando(prev => ({ ...prev, marca: e.target.value }))}
                placeholder="Marca"
              />
              <input
                type="number"
                value={productoEditando.precio}
                onChange={(e) => setProductoEditando(prev => ({ ...prev, precio: e.target.value }))}
                placeholder="Precio"
              />
              <input
                type="number"
                value={productoEditando.stock}
                onChange={(e) => setProductoEditando(prev => ({ ...prev, stock: e.target.value }))}
                placeholder="Stock"
              />

              {/* Imagen actual + input */}
              {productoEditando.imagen && (
                <div style={{ marginBottom: '10px' }}>
                  <img
                    src={productoEditando.imagen}
                    alt="Vista previa"
                    style={{ width: '100px', borderRadius: '8px', marginBottom: '5px' }}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />

              {/* Categoría */}
              <select
                value={productoEditando.categoria}
                onChange={(e) => {
                  const nuevaCategoria = e.target.value;
                  setProductoEditando(prev => ({
                    ...prev,
                    categoria: nuevaCategoria,
                    subcategoria: '' // Reiniciar subcategoría
                  }));
                }}
              >
                <option value="">Selecciona categoría</option>
                {Object.keys(categoriasData).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Subcategoría */}
              <select
                value={productoEditando.subcategoria}
                onChange={(e) => setProductoEditando(prev => ({ ...prev, subcategoria: e.target.value }))}
                disabled={!productoEditando.categoria}
              >
                <option value="">Selecciona subcategoría</option>
                {(categoriasData[productoEditando.categoria] || []).map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>

              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setProductoEditando(null)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;