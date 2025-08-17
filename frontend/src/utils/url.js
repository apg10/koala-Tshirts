// Devuelve el host del backend SIN el sufijo /api
export function backendHost() {
  return (
    import.meta.env.VITE_ASSETS_BASE ||
    (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "")
  ).replace(/\/$/, "");
}

// Resuelve una imagen cualquiera (absoluta, /static/…, o nombre de archivo)
export function resolveImageUrl(image) {
  const base = backendHost();
  if (!image) return null;
  if (typeof image === "string" && /^https?:\/\//.test(image)) return image; // absoluta
  if (typeof image === "string" && image.startsWith("/")) return `${base}${image}`; // /static/…
  return `${base}/static/products/${image}`; // nombre de archivo
}
