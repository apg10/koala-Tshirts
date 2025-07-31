// src/api/request.js
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function request(path, opts = {}, token = "") {
  // Ensure trailing slash on auth routes
  const fixedPath =
    path.startsWith("/auth/") && !path.endsWith("/")
      ? `${path}/`
      : path;

  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${fixedPath}`, {
    ...opts,
    headers,
  });
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${message}`);
  }
  return res.status === 204 ? null : res.json();
}
