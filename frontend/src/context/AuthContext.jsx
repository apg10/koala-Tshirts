// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(JSON.parse(localStorage.getItem("user")));
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
    // OAuth2PasswordRequestForm requires grant_type, username, password
    const form = new URLSearchParams();
    form.append("grant_type", "password");
    form.append("username", email);
    form.append("password", password);

    // Llamamos al endpoint correcto: /login
    const response = await apiClient.post("/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const accessToken = response.data.access_token;
    saveToken(accessToken);

    // Opcional: puedes obtener más info del usuario con /users/me si lo implementas
    const userObj = { email };
    saveUser(userObj);
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
