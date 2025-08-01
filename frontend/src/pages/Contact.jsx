/* src/pages/Contact.jsx */
import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send to backend endpoint /contact/
    console.log("Form submitted:", form);
  };

  return (
    <section className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1" htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            onChange={handleChange}
            value={form.firstName}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            onChange={handleChange}
            value={form.lastName}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            onChange={handleChange}
            value={form.email}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            onChange={handleChange}
            value={form.message}
            className="w-full border rounded px-3 py-2"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}