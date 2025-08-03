// src/api/axios.js
import axios from "axios";

/* Instancia única para toda la app */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // definida en tu .env o en Netlify
});

/* ───────── Interceptor de petición ─────────
   Añade automáticamente el JWT si existe */
api.interceptors.request.use((cfg) => {
  const tk = localStorage.getItem("access_token");
  if (tk) cfg.headers.Authorization = `Bearer ${tk}`;
  return cfg;
});

/* ───────── Interceptor de respuesta ─────────
   Si recibes 401/403, borra token y redirige al login */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
