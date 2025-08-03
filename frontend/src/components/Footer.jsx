import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaArrowUp,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-200 py-10 mt-12">
      <div className="page-wrapper">
        {/* Grilla principal */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold mb-2 text-white">
              Koala T-Shirts
            </h2>
            <p className="text-sm text-gray-400">
              High quality casual apparel delivered with care.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-2 text-white">Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-2 text-white">Contact</h3>
            <a
              href="mailto:support@koalatshirts.com"
              className="hover:underline text-sm block"
            >
              support@koalatshirts.com
            </a>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="font-semibold mb-2 text-white">Follow Us</h3>
            <div className="flex gap-4 text-2xl mt-1">
              <a
                href="https://instagram.com/YourBrand"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-pink-400 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com/YourBrand"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-blue-500 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://youtube.com/YourBrand"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-red-500 transition"
              >
                <FaYoutube />
              </a>
              <a
                href="https://twitter.com/YourBrand"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-blue-300 transition"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Back to top + copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-center mt-10">
          <button
            onClick={handleBackToTop}
            className="btn btn-primary mb-4 lg:mb-0"
          >
            <FaArrowUp className="mr-2" /> Back to top
          </button>
          <div className="text-xs text-gray-500 text-center lg:text-right">
            &copy; {year} Koala T-Shirts. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
