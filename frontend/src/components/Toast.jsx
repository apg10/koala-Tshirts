import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext";

export default function Toast() {
  const { notification } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification || !visible) return null;

  // Esta capa se renderiza sobre <body> para evitar conflictos de CSS
  return createPortal(
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        backgroundColor: "#16A34A",
        color: "#fff",
        padding: "0.75rem 1.5rem",
        borderRadius: "9999px",
        boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
        fontWeight: 600,
        fontSize: "1rem",
        pointerEvents: "auto"
      }}
      role="status"
      aria-live="polite"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
      <span style={{ marginLeft: "0.5rem" }}>{notification.text}</span>
    </div>,
    document.body
  );
}
