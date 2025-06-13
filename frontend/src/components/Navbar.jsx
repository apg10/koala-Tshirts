import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3">
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
        <div className="flex space-x-6 text-sm md:text-base font-medium text-gray-700">
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
              isActive ? "text-blue-600 underline" : "hover:text-blue-600"
            }
          >
            Cart 🛒
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
