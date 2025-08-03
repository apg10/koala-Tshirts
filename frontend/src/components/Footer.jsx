// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-10 border-t border-gray-700 mt-12">
      <div className="page-wrapper">
        {/* Parte superior del footer */}
        <div className="flex flex-wrap justify-between gap-y-12 lg:gap-x-16 text-left">
          {/* Columna 1 */}
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-xl font-bold mb-2 text-white">Koala T-Shirts</h2>
            <p className="text-sm text-gray-400 max-w-xs">
              High quality casual apparel delivered with care.
            </p>
          </div>

          {/* Columna 2 */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="font-semibold mb-2 text-white">Links</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/privacy" className="hover:underline">Privacy</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms & Conditions</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="font-semibold mb-2 text-white">Contact</h3>
            <p className="text-sm">
              <a href="mailto:support@koalatshirts.com" className="hover:underline">
                support@koalatshirts.com
              </a>
            </p>
          </div>

          {/* Columna 4 */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="font-semibold mb-2 text-white">Follow Us</h3>
            <div className="flex gap-4 text-xl mt-2 text-gray-300">
              <a href="#" className="hover:text-white"><FaInstagram /></a>
              <a href="#" className="hover:text-white"><FaFacebook /></a>
              <a href="#" className="hover:text-white"><FaYoutube /></a>
              <a href="#" className="hover:text-white"><FaTwitter /></a>
            </div>
          </div>
        </div>

        {/* Parte inferior del footer */}
        <div className="flex flex-col lg:flex-row justify-between items-center mt-14 pt-6 border-t border-gray-800">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mb-4 lg:mb-0 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-sm"
          >
            ↑ Back to top
          </button>
          <p className="text-sm text-gray-400">© 2025 Koala T-Shirts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
