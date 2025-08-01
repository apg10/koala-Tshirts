import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaArrowUp } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-800 text-gray-200 py-8 mt-12">
      <div className="page-wrapper grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo & Description */}
        <div>
          <h2 className="text-xl font-bold mb-2">Koala T-Shirts</h2>
          <p className="text-gray-400">
            High-quality casual apparel delivered with care.
          </p>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-2xl">
            <a
              href="https://instagram.com/YourBrand"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-500 transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com/YourBrand"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-600 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/YourBrand"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-blue-400 transition-colors"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Contact & Back to Top */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold">Contact</h3>
          <a href="mailto:support@koalatshirts.com" className="hover:underline">
            support@koalatshirts.com
          </a>
          <button
            onClick={handleBackToTop}
            className="mt-4 inline-flex items-center text-gray-300 hover:text-white"
          >
            <FaArrowUp className="mr-2" /> Back to top
          </button>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8">
        &copy; {year} Koala T-Shirts. All rights reserved.
      </div>
    </footer>
  );
}
