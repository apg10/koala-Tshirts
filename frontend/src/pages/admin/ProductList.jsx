// src/pages/admin/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Spinner from "../../components/Spinner";
import Toast from "../../components/Toast";

export default function ProductList() {
  /* ───────── estado ───────── */
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [toast,    setToast]    = useState(null);
  const navigate = useNavigate();

  /* ───────── carga inicial ───────── */
  useEffect(() => {
    api.get("/admin/products")
      .then(res => setProducts(res.data))
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  /* ───────── eliminar un producto ───────── */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      setToast({ text: "Product deleted." });
    } catch {
      setToast({ text: "Could not delete product." });
    } finally {
      setTimeout(() => setToast(null), 2500);
    }
  };

  /* ───────── purgar catálogo completo ───────── */
  const purgeCatalog = async () => {
    if (!window.confirm("⚠️ This will delete ALL products. Continue?")) return;
    try {
      await api.delete("/admin/products/purge");
      setProducts([]);                        // limpia estado local
      setToast({ text: "Catalog purged." });
    } catch {
      setToast({ text: "Could not purge catalog." });
    } finally {
      setTimeout(() => setToast(null), 2500);
    }
  };

  /* ───────── UI ───────── */
  if (loading) return <Spinner />;
  if (error)   return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="page-wrapper py-8">
      {/* Toast local */}
      {toast && <Toast notification={toast} />}

      {/* Header + acciones */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin: Products</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/admin/products/new")}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            + New Product
          </button>
          <button
            onClick={purgeCatalog}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            title="Delete entire catalog"
          >
            🗑️ Purge
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.id}</td>
              <td className="p-3">{p.name}</td>
              <td className="p-3 text-right">${Number(p.price).toFixed(2)}</td>
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="p-6 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
