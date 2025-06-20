import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

/* ───────── layout & pages ───────── */
import Layout         from "./Layout";
import Home           from "./pages/Home";
import ProductDetail  from "./pages/ProductDetail";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Cart           from "./pages/Cart";
import Checkout       from "./pages/Checkout";
import Confirmation   from "./pages/Confirmation";
import About          from "./pages/About";
import Privacy        from "./pages/Privacy";
import Copyright      from "./pages/Copyright";

/* ───────── context providers ───────── */
import { AuthProvider }          from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";

/* ───────── ui components ───────── */
import Toast from "./components/Toast";

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
  const { notification } = useCart(); // { id, text }

  return (
    <>
      <RouteLogger />

      <Routes>
        {/* Detalle de producto */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Rutas que usan el Layout */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart"         element={<Cart />} />
          <Route path="/checkout"     element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/about"     element={<About />} />
          <Route path="/privacy"   element={<Privacy />} />
          <Route path="/copyright" element={<Copyright />} />
        </Route>
      </Routes>

      <Toast message={notification?.text ?? ""} />
    </>
  );
}

/* ──────────────────── root wrapper ──────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
