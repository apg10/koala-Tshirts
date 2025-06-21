// src/components/GuestForm.jsx
import { useState } from "react";

export default function GuestForm({ onSubmit }) {
  const [shipping, setShipping] = useState({
    name:    "",
    email:   "",
    address: "",
  });

  const handleChange = (e) =>
    setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(shipping);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <h2 className="text-xl font-semibold">Shipping Information</h2>

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          value={shipping.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded border-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={shipping.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded border-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <textarea
          name="address"
          value={shipping.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded border-gray-300"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Continue as Guest
      </button>
    </form>
  );
}
