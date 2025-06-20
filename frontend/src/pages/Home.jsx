import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";           // ← Import Carousel
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

// Importa las slides para que Vite las procese
import slide1 from "../assets/slides/slide01.png";
import slide2 from "../assets/slides/slide02.png";
import slide3 from "../assets/slides/slide03.png";

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
    <main className="home-wrapper">
      {/* Carousel de “New Releases” */}
      <Carousel slides={[slide1, slide2, slide3]} />

      {/* Hero banner */}
      <Hero />

      {/* Título del catálogo */}
      <h1 className="section-title">Catalog</h1>

      {/* Estados de carga/error */}
      {loading && <p className="text-center">Loading…</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Listado por categorías */}
      {!loading &&
        !error &&
        categoryOrder.map((category) =>
          grouped[category]?.length > 0 ? (
            <section
              key={category}
              className={`${
                category === "Hoodies" ? "section-hoodies" : "section-products"
              }`}
            >
              <div className="category-block">
                <h2 className="category-title">{category}</h2>
                <div className="product-grid">
                  {grouped[category].map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          ) : null
        )}
    </main>
  );
}
