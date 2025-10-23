export const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'https://ecommerce-anto-backend.vercel.app/api'
    : 'https://ecommerce-anto-backend.vercel.app/api';
