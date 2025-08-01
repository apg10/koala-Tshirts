// src/Layout.jsx
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
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          absolute top-2 left-2
          bg-primary text-white px-3 py-2 rounded
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        "
      >
        Skip to content
      </a>

      <header role="banner">
        <nav aria-label="Main navigation">
          <Navbar />
        </nav>
      </header>

      {/* Toast notifications */}
      <Toast />

      {/* Admin link */}
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

      <main id="main-content" role="main" className="page-wrapper">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>

      <footer role="contentinfo">
        <Footer />
      </footer>
    </>
  );
}
