import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { cartItems } = useCart();
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive ? "text-primary underline" : "hover:text-secondary";

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="page-wrapper flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Koala logo" className="logo" />
          <span className="text-xl font-bold">Koala T-Shirts</span>
        </Link>

        {/* Links */}
        <div className="navbar-links text-sm md:text-base font-medium space-x-4">
          <NavLink to="/"        className={linkClass}>Home</NavLink>
          <NavLink to="/about"   className={linkClass}>About</NavLink>
          <NavLink to="/history" className={linkClass}>History</NavLink>
          <NavLink to="/faq"     className={linkClass}>FAQ</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          <NavLink to="/privacy" className={linkClass}>Privacy</NavLink>
          <NavLink to="/terms"   className={linkClass}>Terms &amp; Conditions</NavLink>

          {user?.is_admin && (
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `${isActive ? "text-red-600 underline" : "text-red-600 hover:underline"}`
              }
            >
              Admin
            </NavLink>
          )}

          {/* Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${isActive ? "text-primary underline" : "hover:text-secondary"} relative`
            }
          >
            🛒 Cart
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5">
                {totalQty}
              </span>
            )}
          </NavLink>

          {/* Auth */}
          {user ? (
            <>
              <span className="hidden sm:inline text-gray-600">👤 {user.email}</span>
              <button
                onClick={logout}
                className="text-sm underline hover:text-secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    className={linkClass}>Log in</NavLink>
              <NavLink to="/register" className={linkClass}>Sign up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
