// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Interceptor para inyectar el JWT en cada petición, SI existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");     // ← clave unificada
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;           // asegurarnos que no quede
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
