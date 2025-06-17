import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { cartItems } = useCart();
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + texto */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Koala T-Shirts logo"
            className="h-10 w-auto"
            width={120}
            height={40}
          />
          <span className="text-xl font-bold text-gray-800">Koala T-Shirts</span>
        </Link>

        {/* Enlaces */}
        <div className="flex space-x-6 text-sm md:text-base font-medium text-gray-700 relative">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600 underline" : "hover:text-blue-600"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "text-blue-600 underline relative" : "hover:text-blue-600 relative"
            }
          >
            Cart 🛒
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {totalQty}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-blue-600 underline" : "hover:text-blue-600"
            }
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
