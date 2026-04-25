import { Link } from "react-router-dom";

/**
 * Minimal, clean navbar for the ZARA-style storefront.
 * Uses the existing CSS classes defined in index.css.
 */
export default function Navbar() {
  return (
    <nav className="bg-white">
      <div className="page-wrapper flex justify-between items-center py-4">
        <Link to="/" className="flex items-center gap-2 text-neutral-900">
          <img src="/assets/logo.png" alt="Koala logo" className="navbar-logo" />
          <span className="navbar-title font-semibold">Koala T-Shirts</span>
        </Link>

        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/" className="nav-btn text-neutral-900 hover:text-neutral-700">Home</Link>
          <Link to="/products" className="nav-btn text-neutral-900 hover:text-neutral-700">Products</Link>
          <Link to="/contact" className="nav-btn text-neutral-900 hover:text-neutral-700">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
