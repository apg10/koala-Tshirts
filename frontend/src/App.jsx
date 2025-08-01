// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout       from "./Layout.jsx";
import Home         from "./pages/Home.jsx";
import About        from "./pages/About.jsx";
import History      from "./pages/History.jsx";
import FAQ          from "./pages/FAQ.jsx";
import Contact      from "./pages/Contact.jsx";
import Cart         from "./pages/Cart.jsx";
import Checkout     from "./pages/Checkout.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Login        from "./pages/Login.jsx";
import Register     from "./pages/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Static pages */}
        <Route path="/"        element={<Home />} />
        <Route path="/about"   element={<About />} />
        <Route path="/history" element={<History />} />
        <Route path="/faq"     element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />

        {/* Shopping flow */}
        <Route path="/cart"         element={<Cart />} />
        <Route path="/checkout"     element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />

        {/* Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
