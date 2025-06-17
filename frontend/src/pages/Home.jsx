import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

/**
 * Home page – hero + three cards per category, all in a single row.
 */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const groupByCategory = () =>
    products.reduce((acc, prod) => {
      const cat =
        typeof prod.category === "object"
          ? prod.category.name
          : prod.category || "Uncategorized";

      if (!acc[cat]) acc[cat] = [];
      if (acc[cat].length < 3) acc[cat].push(prod); // cap at 3
      return acc;
    }, {});

  const grouped = groupByCategory();
  const CATEGORY_ORDER = ["T-Shirts", "Hoodies"]; // display order

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto scroll-smooth">
      {/* Hero banner */}
      <Hero />

      {/* Loading / error states */}
      {loading && <p className="text-gray-500">Loading products…</p>}
      {error && <p className="text-red-500">Could not load products: {error}</p>}

      {/* Category sections */}
      {!loading &&
        !error &&
        CATEGORY_ORDER.map(
          (cat) =>
            grouped[cat]?.length > 0 && (
              <section key={cat} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{cat}</h2>

                {/* exactly three cards per row */}
                <div
                  id={`products-${cat.toLowerCase()}`}
                  className="grid gap-6 grid-cols-3"
                >
                  {grouped[cat].map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )
        )}
    </main>
  );
}
