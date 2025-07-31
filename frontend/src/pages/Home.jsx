// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import Hero from "../components/Hero";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

import slide1 from "../assets/slides/slide01.png";
import slide2 from "../assets/slides/slide02.png";
import slide3 from "../assets/slides/slide03.png";

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState({
    category: searchParams.get("category") || "All",
    term:     searchParams.get("search")   || ""
  });
  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
    fetch(`${API_URL}/products`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const catName   = typeof p.category === "object" ? p.category.name : p.category;
    const matchCat  = filter.category === "All" || catName === filter.category;
    const matchTerm = p.name.toLowerCase().includes(filter.term.toLowerCase());
    return matchCat && matchTerm;
  });

  const visible = filtered.slice(0, page * ITEMS_PER_PAGE);
  const categoryOrder = ["T-Shirts", "Hoodies"];

  return (
    <main className="home-wrapper page-wrapper py-8">
      <Carousel slides={[slide1, slide2, slide3]} />
      <div className="my-8" />

      <Hero />
      <div className="my-8" />

      <FilterBar onFilter={setFilter} />
      <h1 className="section-title mt-8">Catalog</h1>
      <hr className="my-4 border-gray-200" />

      {loading && <Spinner />}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && categoryOrder.map(category => {
        const items = visible
          .filter(p => {
            const name = typeof p.category === "object" ? p.category.name : p.category;
            return name === category;
          })
          .slice(0, 3);
        if (items.length === 0) return null;
        return (
          <section key={category} className="my-8">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {items.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length > page * ITEMS_PER_PAGE && (
        <div className="text-center my-8">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition"
          >
            Load More
          </button>
        </div>
      )}
    </main>
);
}
