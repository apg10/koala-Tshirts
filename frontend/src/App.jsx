// src/App.jsx
import { Routes, Route } from "react-router-dom";

/* ── Shell ── */
import Layout from "./Layout";

/* ── Públicas ── */
import Home          from "./pages/Home";
import About         from "./pages/About";
import History       from "./pages/History";
import FAQ           from "./pages/FAQ";
import Contact       from "./pages/Contact";
import Cart          from "./pages/Cart";
import Checkout      from "./pages/Checkout";
import Confirmation  from "./pages/Confirmation";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";   // si lo tienes

/* ── Admin ── */
import AdminRoute   from "./components/AdminRoute";
import ProductList  from "./pages/admin/ProductList";
import ProductNew   from "./pages/admin/ProductNew";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* página principal */}
        <Route index element={<Home />} />

        {/* públicas */}
        <Route path="about"         element={<About />} />
        <Route path="history"       element={<History />} />
        <Route path="faq"           element={<FAQ />} />
        <Route path="contact"       element={<Contact />} />
        <Route path="product/:id"   element={<ProductDetail />} />

        {/* carrito / checkout */}
        <Route path="cart"          element={<Cart />} />
        <Route path="checkout"      element={<Checkout />} />
        <Route path="confirmation"  element={<Confirmation />} />

        {/* auth */}
        <Route path="login"    element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* admin (protegido) */}
        <Route element={<AdminRoute />}>
          <Route path="admin/products"     element={<ProductList />} />
          <Route path="admin/products/new" element={<ProductNew />} />
        </Route>

        {/* 404 genérico */}
        <Route
          path="*"
          element={<h1 style={{ textAlign: "center" }}>404 – Page not found</h1>}
        />
      </Route>
    </Routes>
  );
}
