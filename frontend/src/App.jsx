// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

/* ───────── layout & pages ───────── */
import Layout        from "./Layout";
import Home          from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Cart          from "./pages/Cart";
import Checkout      from "./pages/Checkout";
import Confirmation  from "./pages/Confirmation";
import About         from "./pages/About";
import Privacy       from "./pages/Privacy";
import Copyright     from "./pages/Copyright";

/* ───────── ui components ───────── */
import Toast          from "./components/Toast";
import PrivateRoute   from "./components/PrivateRoute";

/* ───────── context hook ───────── */
import { useCart }   from "./context/CartContext";

/* ──────────────────── helpers ──────────────────── */
function RouteLogger() {
  const location = useLocation();
  useEffect(() => {
    console.log(`[ROUTER] Navigated to: ${location.pathname}`);
  }, [location]);
  return null;
}

/* ──────────────────── main app content ──────────────────── */
function AppContent() {
  const { notification } = useCart();

  return (
    <>
      <RouteLogger />

      <Routes>
        {/* Todas dentro de Layout */}
        <Route element={<Layout />}>
          {/* Páginas públicas */}
          <Route index                            element={<Home />} />
          <Route path="product/:id"               element={<ProductDetail />} />
          <Route path="login"                     element={<Login />} />
          <Route path="register"                  element={<Register />} />
          <Route path="cart"                      element={<Cart />} />

          {/* Rutas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="checkout"               element={<Checkout />} />
            <Route path="confirmation"           element={<Confirmation />} />
          </Route>

          {/* Legales y demás */}
          <Route path="about"                     element={<About />} />
          <Route path="privacy"                   element={<Privacy />} />
          <Route path="copyright"                 element={<Copyright />} />
        </Route>
      </Routes>

      <Toast message={notification?.text ?? ""} />
    </>
  );
}

/* ──────────────────── root wrapper ──────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
