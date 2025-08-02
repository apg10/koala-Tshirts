// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";                      // ← usa SIEMPRE la misma instancia

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  /* ───────── estado ───────── */
  const [user,  setUser]  = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || ""
  );

  /* Inyecta el token en la instancia global (al recargar página) */
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  /* ───────── helpers ───────── */
  const saveToken = (t) => {
    setToken(t);
    localStorage.setItem("access_token", t);         // ← nombre único
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
  };

  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  /* ───────── login ───────── */
  const login = async (email, password) => {
    const form = new URLSearchParams();
    form.append("grant_type", "password");
    form.append("username", email);
    form.append("password", password);

    const { data } = await api.post("/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    /* El backend debe devolver { access_token, is_admin } */
    saveToken(data.access_token);
    saveUser({ email, is_admin: data.is_admin });
  };

  /* ───────── register ───────── */
  const register = async (email, password) => {
    await api.post("/users/", { email, password });
    await login(email, password);                    // autologin
  };

  /* ───────── logout ───────── */
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
