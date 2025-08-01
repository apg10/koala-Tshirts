/* src/pages/FAQ.jsx */
import React, { useState } from "react";

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Shipping within Colombia takes 3-5 business days."
  },
  {
    question: "What is your return policy?",
    answer: "You can return or exchange items within 14 days of delivery."
  },
  // Add more FAQ entries here
];

export default function FAQ() {
  return (
    <section className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((item, index) => (
          <details key={index} className="border rounded p-4">
            <summary className="font-semibold cursor-pointer">{item.question}</summary>
            <p className="mt-2">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}