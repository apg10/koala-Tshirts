// src/components/AdminProductForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function AdminProductForm() {
  const { id } = useParams();            // undefined en "new", id en "edit/:id"
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", price: "", category: "", image: null
  });
  const [loading, setLoading] = useState(false);

  // Si estamos editando, cargar datos
  useEffect(() => {
    if (id) {
      setLoading(true);
      apiClient.get(`/products/${id}`)
        .then(res => {
          const { name, price, category, image } = res.data;
          setForm({ name, price, category, image: null });
        })
        .catch(() => alert("Could not load product"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "image") setForm(prev => ({ ...prev, image: files[0] }));
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("category", form.category);
    if (form.image) data.append("image", form.image);

    try {
      if (id) {
        await apiClient.put(`/products/${id}`, data);
        alert("Product updated.");
      } else {
        await apiClient.post("/products", data);
        alert("Product created.");
      }
      navigate("/admin/products");
    } catch {
      alert("Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-wrapper py-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {id ? "Edit Product" : "New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Image</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
            {...(id ? {} : { required: true })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Saving…" : id ? "Update" : "Create"}
        </button>
      </form>
    </section>
  );
}
