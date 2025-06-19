import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

/* ───────── layout & pages ───────── */
import Layout        from "./Layout";
import Home          from "./pages/Home";
import Cart          from "./pages/Cart";
import Checkout      from "./pages/Checkout";
import Confirmation  from "./pages/Confirmation";
import About         from "./pages/About";
import Privacy       from "./pages/Privacy";
import Copyright     from "./pages/Copyright";

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
  const { notification } = useCart();          // { id, text }

  return (
    <>
      <RouteLogger />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/"              element={<Home />} />
          <Route path="/cart"          element={<Cart />} />
          <Route path="/checkout"      element={<Checkout />} />
          <Route path="/confirmation"  element={<Confirmation />} />
          <Route path="/about"         element={<About />} />
          <Route path="/privacy"       element={<Privacy />} />
          <Route path="/copyright"     element={<Copyright />} />
        </Route>
      </Routes>

      {/* Toast global – recibe sólo el texto */}
      <Toast message={notification?.text ?? ""} />
    </>
  );
}

/* ──────────────────── root wrapper ──────────────────── */
export default function App() {
  return (
    <AuthProvider>     {/* ← gestiona login/register + token */}
      <CartProvider>   {/* ← carrito (local + futuro remoto)   */}
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
