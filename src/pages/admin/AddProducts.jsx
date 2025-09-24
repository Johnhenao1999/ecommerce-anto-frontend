import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanel.css';
import Navbar from '../../components/Navbar/Navbar';
import { obtenerCategorias } from '../../services/categoriasService';

const AdminPanel = () => {
  const preset_name = 'anto_store';
  const cloud_name = 'djzdunsof';

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    marca: '',
    imagen: '',
    stock: '',
    categoria: '',
    subcategoria: '',
    tieneDescuento: false,
    porcentajeDescuento: ''
  });

  const [categoriasData, setCategoriasData] = useState({});
  const [subcategorias, setSubcategorias] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        const formato = {};
        data.forEach(cat => {
          formato[cat.nombre] = cat.subcategorias.map(sub => sub.nombre);
        });
        setCategoriasData(formato);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    cargarCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === 'tieneDescuento' && !checked ? { porcentajeDescuento: '' } : {})
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    if (name === 'categoria') {
      setSubcategorias(categoriasData[value] || []);
      setFormData((prev) => ({ ...prev, subcategoria: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendo(true);
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset_name);
    form.append('cloud_name', cloud_name);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      setFormData((prev) => ({ ...prev, imagen: data.secure_url }));
    } catch (err) {
      console.error('Error al subir imagen:', err);
    } finally {
      setSubiendo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      categoriaNombre: formData.categoria,
      subcategoriaNombre: formData.subcategoria,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      marca: formData.marca,
      imagen: formData.imagen,
      tieneDescuento: formData.tieneDescuento,
      porcentajeDescuento: formData.tieneDescuento ? parseFloat(formData.porcentajeDescuento) : 0
    };

    try {
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ Error del servidor:', data);
        setMensaje('❌ Error al agregar producto');
        return;
      }

      console.log('✅ Producto agregado:', data);
      setMensaje('✅ Producto agregado correctamente');

      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        marca: '',
        imagen: '',
        categoria: '',
        subcategoria: '',
        tieneDescuento: false,
        porcentajeDescuento: ''
      });
    } catch (err) {
      console.error('❌ Error al enviar al backend:', err);
      setMensaje('❌ Error de conexión al servidor');
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-panel section-admin">
        <h2>Agregar producto</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="row">
            <div className="form-group">
              <label>Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange} required>
                <option value="">Selecciona categoría</option>
                {Object.keys(categoriasData).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {subcategorias.length > 0 && (
              <div className="form-group">
                <label>Subcategoría</label>
                <select name="subcategoria" value={formData.subcategoria} onChange={handleChange} required>
                  <option value="">Selecciona subcategoría</option>
                  {subcategorias.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="row">
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Marca</label>
              <input type="text" name="marca" value={formData.marca} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Precio</label>
              <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} required />
            </div>
          </div>

          <div className='row'>
            <div className="form-group">
              <label className='label-sale'>
                <input
                  type="checkbox"
                  name="tieneDescuento"
                  checked={formData.tieneDescuento}
                  onChange={handleChange}
                />
                ¿Tiene descuento?
              </label>
            </div>
            {formData.tieneDescuento && (
              <div className="form-group">
                <label>Porcentaje de descuento (%)</label>
                <input
                  type="number"
                  name="porcentajeDescuento"
                  value={formData.porcentajeDescuento}
                  min="1"
                  max="100"
                  onChange={handleChange}
                  required
                />
                {formData.precio && (
                  <small>
                    Precio final: ${(
                      formData.precio -
                      (formData.precio * formData.porcentajeDescuento) / 100
                    ).toFixed(2)}
                  </small>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Imagen</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {subiendo ? (
              <small>Subiendo imagen...</small>
            ) : formData.imagen && (
              <img
                src={formData.imagen}
                alt="preview"
                style={{ marginTop: '10px', width: '100px', borderRadius: '8px' }}
              />
            )}
          </div>

          <button type="submit">Agregar producto</button>
          {mensaje && <div className="success-message">{mensaje}</div>}
        </form>
      </div>
    </>
  );
};

export default AdminPanel;
