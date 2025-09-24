export const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/api'
    : 'https://ecommerce-anto-backend.vercel.app/api';
