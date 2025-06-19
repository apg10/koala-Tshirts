import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

/**
 * Home page – hero + three cards per category, always aligned in one row.
 */
export default function Home() {
  /* ──────────────── state ──────────────── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ──────────────── fetch ──────────────── */
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

    // NOTE: backend route is /products/products/  (trailing slash matters)
    fetch(`${API_URL}/products/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* ───────────── agrupado por categoría ───────────── */
  const grouped = products.reduce((acc, prod) => {
    const cat =
      typeof prod.category === "object"
        ? prod.category.name
        : prod.category || "Uncategorized";

    if (!acc[cat]) acc[cat] = [];
    if (acc[cat].length < 3) acc[cat].push(prod); // máximo 3 productos por categoría
    return acc;
  }, {});

  const categoryOrder = ["T-Shirts", "Hoodies"]; // orden deseado

  /* ──────────────── render ──────────────── */
  return (
    <main className="px-4 py-8 max-w-7xl mx-auto scroll-smooth">
      {/* Hero banner */}
      <Hero />

      <section id="products" className="px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Catalog
        </h1>

        {loading && <p className="text-center text-gray-500">Loading…</p>}
        {error && (
          <p className="text-center text-red-500">
            Could not load products: {error}
          </p>
        )}

        {!loading && !error && (
          <div className="max-w-7xl mx-auto space-y-16">
            {categoryOrder.map(
              (category) =>
                grouped[category]?.length > 0 && (
                  <div key={category}>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                      {category}
                    </h2>

                    {/* Always 3 cards per row from the sm breakpoint up */}
                    <div className="product-grid">
                      {grouped[category].map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>                    
                  </div>
                )
            )}
          </div>
        )}
      </section>
    </main>
  );
}
