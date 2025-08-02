/* src/pages/History.jsx */
import React from "react";

export default function History() {
  return (
    <section className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">History &amp; Structure</h1>

      {/* History */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">History of the Company</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>
            <strong>1992:</strong> Founded by Mr Koah La and his wife Tee Shar in Sydney CBD, sourcing t-shirts from a factory in Cabramatta. :contentReference[oaicite:4]{index=4}
          </li>
          <li>
            <strong>2023:</strong> Introduced extra-large sizes to meet rising market demand. :contentReference[oaicite:5]{index=5}
          </li>
        </ul>
      </div>

      {/* Company Structure */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Structure of the Company</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>
            <strong>Koah La:</strong>  
            Responsible for purchasing (weekly trips to T-shirt4All in Cabramatta), returns, payments, and overall finance control. :contentReference[oaicite:6]{index=6}
          </li>
          <li>
            <strong>Tee Shar:</strong>  
            Selects products via the supplier catalogue, manages store layout and display, y evalúa la adopción de un sistema de gestión de clientes por email. :contentReference[oaicite:7]{index=7}
          </li>
        </ul>
      </div>
    </section>
  );
}
