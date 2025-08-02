// src/pages/admin/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import Spinner from "../../components/Spinner";
import Toast from "../../components/Toast";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("/admin/products")
      .then(res => setProducts(res.data))
      .catch(err => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiClient.delete(`/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      setToast({ text: "Product deleted." });
      setTimeout(() => setToast(null), 2500);
    } catch {
      setToast({ text: "Could not delete product." });
      setTimeout(() => setToast(null), 2500);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="page-wrapper py-8">
      {toast && <Toast notification={toast} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin: Products</h1>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          + New Product
        </button>
      </div>

      <table className="w-full bg-white shadow rounded overflow-hidden text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Size</th>
            <th className="p-3 text-left">Color</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.id}</td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.size}</td>
              <td className="p-3">{p.color}</td>
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
        </tbody>
      </table>
    </section>
  );
}
