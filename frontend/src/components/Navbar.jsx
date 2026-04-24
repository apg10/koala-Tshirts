import { Link } from "react-router-dom";

/**
 * Minimal, clean navbar for the ZARA‑style storefront.
 * Uses the existing CSS classes defined in index.css.
 */
export default function Navbar() {
  return (
    <nav className="navbar bg-white border-b border-gray-200">
      <div className="page-wrapper nav-inner">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Koala logo" className="navbar-logo" />
          <span className="navbar-title">Koala T-Shirts</span>
        </Link>

        <div className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/products" className="nav-btn">Products</Link>
          <Link to="/contact" className="nav-btn">Contact</Link>
        </div>
      </div>
    </nav>
  );
}

