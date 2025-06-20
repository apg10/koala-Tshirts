import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200 py-6">
      <div className="page-wrapper flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Koala T-Shirts</p>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/copyright" className="hover:underline">
            Copyright
          </Link>
        </div>
      </div>
    </footer>
  );
}
