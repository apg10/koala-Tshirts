// src/components/AdminProductForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminProductForm() {
  /* ───────── estado del formulario ───────── */
  const [form, setForm] = useState({
    name: "",        description: "",  price: "",
    size: "",        color: "",        category_id: "",
    image: null,
  });

  /* ───────── lista de categorías ───────── */
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL;
    axios.get(`${API}/categories`)
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  /* ───────── handlers ───────── */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== "") fd.append(k, v);
    });
    if (form.price)        fd.set("price", Number(form.price));
    if (form.category_id)  fd.set("category_id", Number(form.category_id));

    try {
      const token = 
        localStorage.getItem("access_token") || localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/products`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Producto creado 🎉");
      /* limpia el form */
      setForm({
        name: "", description: "", price: "",
        size: "", color: "", category_id: "", image: null,
      });
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ Error: revisa consola");
    }
  };

  /* ───────── UI ───────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Descripción"
      />

      <input
        name="price"
        type="number"
        step="0.01"
        value={form.price}
        onChange={handleChange}
        placeholder="Precio"
        required
      />

      {/* Talla y color (puedes convertir a <select> si lo deseas) */}
      <input
        name="size"
        value={form.size}
        onChange={handleChange}
        placeholder="Talla (S, M, L…)"
      />
      <input
        name="color"
        value={form.color}
        onChange={handleChange}
        placeholder="Color"
      />

      {/* Selector de categoría dinámico */}
      <select
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona categoría…</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Crear producto
      </button>
    </form>
  );
}
