/* src/pages/History.jsx */
import React from "react";

export default function History() {
  return (
    <section className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Our History</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>2025:</strong> Founded Koala T-Shirts in Buga, Colombia.</li>
        <li><strong>2026:</strong> Expanded to Armenia and Pereira.</li>
        {/* Add more milestones as needed */}
      </ul>
    </section>
  );
}
