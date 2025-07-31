// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail]     = useState("");
  const [pass,  setPass]      = useState("");
  const [err,   setErr]       = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    // Simple client-side validation
    if (!/.+@.+\..+/.test(email)) {
      return setErr("Please enter a valid email");
    }
    if (pass.length < 6) {
      return setErr("Password must be at least 6 characters");
    }
    setErr("");
    setLoading(true);
    try {
      await login(email, pass);
      nav("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-8 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>
      {err && <p className="mb-4 text-red-600 text-sm">{err}</p>}
      <form onSubmit={handle} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? <Spinner /> : "Log in"}
        </button>
      </form>
    </div>
  );
}
