import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Toast({ message }) {
  const [open, setOpen] = useState(false);

  /* show 2.5 s whenever message changes and is truthy */
  useEffect(() => {
    if (message) {
      setOpen(true);
      const t = setTimeout(() => setOpen(false), 2500);
      return () => clearTimeout(t);
    }
  }, [message]);

  /* don’t render anything if closed or empty */
  if (!open || !message) return null;

  /* inline styles → completely bypass Tailwind / PostCSS */
  const style = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    minWidth: "220px",
    maxWidth: "320px",
    padding: "12px 16px",
    background: "#16a34a",           // green-600
    color: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,.15)",
    fontSize: "0.875rem",
    lineHeight: 1.4,
  };

  return createPortal(<div style={style}>{message}</div>, document.body);
}
