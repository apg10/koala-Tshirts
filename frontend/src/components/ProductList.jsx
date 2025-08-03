// src/pages/admin/ProductList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import Spinner from "../../components/Spinner";
import Toast from "../../components/Toast";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [toast, setToast]       = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("/admin/products")
      .then(res => setProducts(res.data))
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiClient.delete(`/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      setToast({ text: "Product deleted.", type: "success" });
    } catch {
      setToast({ text: "Could not delete product.", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 2500);
    }
  };

  if (loading) return <Spinner />;
  if (error)   return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <section className="page-wrapper py-8">
      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          className="mb-6"
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">Admin: Products</h1>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          + New Product
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["ID","Name","Size","Color","Price","Actions"].map((h, i) => (
                <th
                  key={i}
                  className={`p-3 ${
                    i === 4 ? "text-right" :
                    i === 5 ? "text-center" :
                    "text-left"
                  } font-medium text-gray-600`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr
                key={p.id}
                className={`
                  ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  hover:bg-gray-100 transition
                `}
              >
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.size}</td>
                <td className="p-3">{p.color}</td>
                <td className="p-3 text-right">${Number(p.price).toFixed(2)}</td>
                <td className="p-3 text-center space-x-4">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                    className="text-primary hover:underline"
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
      </div>
    </section>
  );
}
