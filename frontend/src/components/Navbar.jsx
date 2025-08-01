// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { cartItems } = useCart();
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="page-wrapper flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Koala logo" className="logo" />
          <span className="text-xl font-bold text-gray-800">
            Koala T-Shirts
          </span>
        </Link>

        <div className="navbar-links text-sm md:text-base font-medium text-gray-700 space-x-4">
          <NavLink to="/"      className={({isActive}) => isActive ? "text-primary underline" : "hover:text-primary"}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "text-primary underline" : "hover:text-primary"}>About</NavLink>
          <NavLink to="/history" className={({isActive}) => isActive ? "text-primary underline" : "hover:text-primary"}>History</NavLink>
          <NavLink to="/faq"   className={({isActive}) => isActive ? "text-primary underline" : "hover:text-primary"}>FAQ</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? "text-primary underline" : "hover:text-primary"}>Contact</NavLink>

          <NavLink to="/cart" className={({isActive}) => `${isActive ? "text-primary underline" : "hover:text-primary"} relative`}>
            🛒 Cart
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5">
                {totalQty}
              </span>
            )}
          </NavLink>

          {user ? (
            <>
              <span className="hidden sm:inline text-gray-600">👤 {user.email}</span>
              <button onClick={logout} className="text-sm underline hover:text-primary">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    className={({isActive}) => isActive ? "text-primary underline" : "hover:text-primary"}>Log in</NavLink>
              <NavLink to="/register" className={({isActive}) => isActive ? "text-primary underline" : "hover:text-primary"}>Sign up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
