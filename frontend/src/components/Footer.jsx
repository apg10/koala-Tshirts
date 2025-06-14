import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-gray-600 py-6 mt-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Koala T-Shirts</p>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/copyright" className="hover:underline">Copyright</Link>
        </div>
      </div>
    </footer>
  );
}
