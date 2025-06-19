import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  /* carrito */
  const { cartItems } = useCart();
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);

  /* autenticación */
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ───── Logo ───── */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Koala logo" className="logo" />
          <span className="text-xl font-bold text-gray-800">
            Koala&nbsp;T-Shirts
          </span>
        </Link>

        {/* ───── Links principales ───── */}
        <div className="flex items-center gap-6 text-sm md:text-base font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-primary underline" : "hover:text-primary"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-primary underline" : "hover:text-primary"
            }
          >
            About
          </NavLink>

          {/* ───── Cart with badge ───── */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${isActive ? "text-primary underline" : "hover:text-primary"} relative`
            }
          >
            🛒 Cart
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5">
                {totalQty}
              </span>
            )}
          </NavLink>

          {/* ───── Auth area ───── */}
          {user ? (
            <>
              <span className="hidden sm:inline text-gray-600">👤 {user.email}</span>
              <button
                onClick={logout}
                className="text-sm underline hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-primary underline" : "hover:text-primary"
                }
              >
                Log&nbsp;in
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "text-primary underline" : "hover:text-primary"
                }
              >
                Sign&nbsp;up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
