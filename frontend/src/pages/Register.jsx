import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [err,   setErr]   = useState("");

  const handle = async (e) => {
    e.preventDefault();
    try {
      await Register(email, pass);
      nav("/");           // a home tras login
    } catch (error) {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-8 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>
      {err && <p className="mb-4 text-red-600 text-sm">{err}</p>}
      <form onSubmit={handle} className="space-y-4">
        <input className="w-full border p-2 rounded"
               placeholder="Email"
               type="email"
               value={email}
               onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded"
               placeholder="Password"
               type="password"
               value={pass}
               onChange={(e)=>setPass(e.target.value)} />
        <button className="w-full bg-primary text-white py-2 rounded">
          Log in
        </button>
      </form>
    </div>
  );
}
