import React from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import { Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function Layout() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      {/* Toast importado aquí */}
      <Toast />

      {/* Enlace para administradores */}
      {user?.is_admin && (
        <div className="admin-link-container text-center my-2">
          <a
            href="/admin/products/new"
            className="text-blue-600 hover:underline"
          >
            + Add New Product
          </a>
        </div>
      )}

      <div className="page-wrapper">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}
