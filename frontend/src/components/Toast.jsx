import { useEffect, useState } from "react";

/**
 * Simple toast que recibe un *string*.
 * Muestra 2.5 s y luego se desvanece.
 */
export default function Toast({ message }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log("[TOAST] Incoming message:", message);
    if (message) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(t);
    }
  }, [message]); // ← se dispara cada vez que llega un nuevo string

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-[9999] animate-fade-in-out">
      {message}
    </div>
  );
}
