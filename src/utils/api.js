export const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/api'
    : 'http://localhost:3000/api';
