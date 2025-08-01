// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout             from "./Layout";
import Home               from "./pages/Home";
import About              from "./pages/About";
import History            from "./pages/History";
import FAQ                from "./pages/FAQ";
import Contact            from "./pages/Contact";
import Cart               from "./pages/Cart";
import Checkout           from "./pages/Checkout";
import Confirmation       from "./pages/Confirmation";
import Login              from "./pages/Login";
import Register           from "./pages/Register";

// Admin
import AdminRoute         from "./components/AdminRoute";
import ProductList        from "./pages/admin/ProductList";
import AdminProductForm   from "./components/AdminProductForm";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/"        element={<Home />} />
        <Route path="/about"   element={<About />} />
        <Route path="/history" element={<History />} />
        <Route path="/faq"     element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/cart"         element={<Cart />} />
        <Route path="/checkout"     element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />

        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/products"          element={<ProductList />} />
          <Route path="/admin/products/new"      element={<AdminProductForm />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
        </Route>
      </Route>
    </Routes>
  );
}
