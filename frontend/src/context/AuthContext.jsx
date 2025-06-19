import { createContext, useContext, useState } from "react";
import { request } from "../api/request";

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const save = (u, t) => {
    setUser(u); setToken(t);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", t);
  };

  /* ---------- API calls ---------- */
  const login = async (email, password) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    save(data.user, data.access_token);
  };

  const register = async (email, password) => {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    save(data.user, data.access_token);
  };

  const logout = () => {
    setUser(null); setToken("");
    localStorage.removeItem("user"); localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
