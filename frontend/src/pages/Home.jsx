import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
    fetch(`${API_URL}/products/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const grouped = products.reduce((acc, prod) => {
    const cat =
      typeof prod.category === "object"
        ? prod.category.name
        : prod.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    if (acc[cat].length < 3) acc[cat].push(prod);
    return acc;
  }, {});

  const categoryOrder = ["T-Shirts", "Hoodies"];

  return (
    <main className="home-wrapper"> {/* opcional wrapper para centrar */}
      <Hero />

      <section id="products" className="section-products">
        <h1 className="section-title">Catalog</h1>

        {loading && <p className="text-center">Loading…</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading &&
          !error &&
          categoryOrder.map((category) =>
            grouped[category]?.length > 0 ? (
              <div key={category} className="category-block">
                <h2 className="category-title">{category}</h2>
                <div className="product-grid">
                  {grouped[category].map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : null
          )}
      </section>
    </main>
  );
}
