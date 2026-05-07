// src/components/AdminProductForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import FormMessage from "./FormMessage";

export default function AdminProductForm({ productId }) {
  /* ──── estado del formulario ──── */
  const [form, setForm] = useState({
    name: "",        description: "",  price: "",
    size: "",        color: "",        category_id: "",
    image: null,
  });

  /* ──── lista de categorías ──── */
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingCategories(true);
    setCategoriesError(null);
    api.get("/categories")
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
        setCategoriesError("❌ Error al cargar las categorías");
      })
      .finally(() => setLoadingCategories(false));
    
    // If we have a productId, fetch the product data for editing
    if (productId) {
      setLoading(true);
      api.get(`/admin/products/${productId}`)
        .then(res => {
          // Map only the form fields we need to avoid sending image filename strings
          setForm({
            name: res.data.name ?? "",
            description: res.data.description ?? "",
            price: res.data.price ?? "",
            size: res.data.size ?? "",
            color: res.data.color ?? "",
            category_id: res.data.category_id ?? res.data.category?.id ?? "",
            image: null // Reset image to null to prevent filename strings from being sent
          });
        })
        .catch(err => {
          console.error("Error fetching product:", err);
          setMessage({ text: "❌ Error al cargar el producto", type: "error" });
        })
        .finally(() => setLoading(false));
    }
  }, [productId]);

  /* ──── handlers ──── */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submits while saving
    if (isSaving || loadingCategories || categoriesError || categories.length === 0) return;

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== "") fd.append(k, v);
    });
    if (form.price)        fd.set("price", Number(form.price));
    if (form.category_id)  fd.set("category_id", Number(form.category_id));

    try {
      setIsSaving(true);
      if (productId) {
        // Update existing product
        await api.put(`/admin/products/${productId}`, fd);
        setMessage({ text: "Producto actualizado 🎉", type: "success" });
        // Navigate back to product list after successful edit
        navigate("/admin/products");
      } else {
        // Create new product
        await api.post("/admin/products", fd);
        setMessage({ text: "Producto creado 🎉", type: "success" });
        /* limpia el form */
        setForm({
          name: "", description: "", price: "",
          size: "", color: "", category_id: "", image: null,
        });
        // Navigate back to product list after successful create
        navigate("/admin/products");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage({ text: "❌ Error: revisa consola", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  /* ──── UI ──── */
  if (loading) {
    return <div>Cargando producto...</div>;
  }

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
        required
      />
      <input
        name="color"
        value={form.color}
        onChange={handleChange}
        placeholder="Color"
        required
      />

      {/* Selector de categoría dinámico */}
      <select
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
        required
        disabled={loadingCategories || categoriesError || categories.length === 0}
      >
        {loadingCategories ? (
          <option value="">Cargando categorías...</option>
        ) : categoriesError ? (
          <option value="">Error al cargar categorías</option>
        ) : categories.length === 0 ? (
          <option value="">No hay categorías disponibles</option>
        ) : (
          <>
            <option value="">Selecciona categoría…</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </>
        )}
      </select>

      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        required={!productId}
      />

      {message && (
        <FormMessage 
          message={message.text} 
          type={message.type}
        />
      )}

      {categoriesError && (
        <FormMessage
          message={categoriesError}
          type="error"
        />
      )}

      <button 
        className="bg-black text-white px-4 py-2 rounded"
        disabled={isSaving || loadingCategories || categoriesError || categories.length === 0}
      >
        {isSaving ? "Guardando..." : (productId ? "Guardar cambios" : "Crear producto")}
      </button>
    </form>
  );
}
