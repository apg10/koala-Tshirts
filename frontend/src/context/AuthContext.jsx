// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Inicializa a partir de localStorage, esperando { email, is_admin }
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const saveToken = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  };

  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  /* ─── LOGIN ─── */
  const login = async (email, password) => {
    const form = new URLSearchParams();
    form.append("grant_type", "password");
    form.append("username", email);
    form.append("password", password);

    const response = await apiClient.post("/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Extraemos access_token e is_admin
    const { access_token, is_admin } = response.data;
    saveToken(access_token);

    // Guardamos email + is_admin
    saveUser({ email, is_admin });
  };

  /* ─── REGISTER ─── */
  const register = async (email, password) => {
    await apiClient.post("/users/", { email, password });
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
