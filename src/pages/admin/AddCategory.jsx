import React, { useState } from 'react';
import '../../styles/AddCategory.css';
import Navbar from '../../components/Navbar/Navbar';

const CrearCategoria = () => {
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [subcategorias, setSubcategorias] = useState(['']);
  const [mensaje, setMensaje] = useState('');

  const agregarSubcategoria = () => {
    setSubcategorias([...subcategorias, '']);
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
    if (!nombreCategoria) {
      setMensaje('⚠️ Todos los campos son obligatorios.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreCategoria,
          subcategorias: subcategorias
            .map(sub => sub.trim())
            .filter(sub => sub !== '') // eliminar vacías
        })
      });

      if (!res.ok) throw new Error('Error en la creación');

      const data = await res.json();
      setMensaje(`✅ Categoría "${data.categoria.nombre}" creada con éxito.`);
      setNombreCategoria('');
      setSubcategorias(['']);
    } catch (err) {
      console.error('Error al crear categoría:', err);
      setMensaje('❌ Error al crear la categoría.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="crear-categoria section-admin">
        <h2>Crear Nueva Categoría</h2>
        {mensaje && <p>{mensaje}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
            required
          />

          <h4>Subcategorías</h4>
          {subcategorias.map((sub, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
              <input
                type="text"
                placeholder={`Subcategoría ${i + 1}`}
                value={sub}
                onChange={(e) => actualizarSubcategoria(i, e.target.value)}
              />
              {subcategorias.length > 1 && (
                <button type="button" onClick={() => eliminarSubcategoria(i)}>🗑️</button>
              )}
            </div>
          ))}

          <button type="button" onClick={agregarSubcategoria}>+ Agregar Subcategoría</button>
          <br /><br />
          <button type="submit">Guardar Categoría</button>
        </form>
      </div>
    </>
  );
};

export default CrearCategoria;
