import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; // Asegúrate de tener este archivo CSS
import { div } from 'framer-motion/client';
import { API_BASE } from '../utils/api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate(); // ← Aquí

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { token, usuario } = res.data;

      // Guardar token en localStorage
      localStorage.setItem('token', token);
      setMensaje('Login exitoso');
      navigate('/admin/list-products');
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className='container-login'>
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Ingresar</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default Login;
