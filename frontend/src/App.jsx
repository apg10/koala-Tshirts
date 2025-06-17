import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Copyright from "./pages/Copyright";
import { useEffect } from "react";

function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    console.log(`[ROUTER] Navigated to: ${location.pathname}`);
  }, [location]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteLogger />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/copyright" element={<Copyright />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
