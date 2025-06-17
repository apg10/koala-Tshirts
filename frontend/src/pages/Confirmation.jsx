import { Link } from "react-router-dom";

export default function Confirmation() {
  return (
    <section className="p-6 text-center max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Thank you!</h1>
      <p className="text-gray-700 mb-6">
        Your order has been successfully placed.  
        We’ll process it as soon as possible.
      </p>
      <img
        src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
        alt="Order confirmed"
        className="mx-auto mb-6 w-24 h-24"
      />
      <Link
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Return to Shop
      </Link>
    </section>
  );
}
