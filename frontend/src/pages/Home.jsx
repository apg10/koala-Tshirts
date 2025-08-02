// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Carousel    from "../components/Carousel";
import Hero        from "../components/Hero";
import FilterBar   from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import Spinner     from "../components/Spinner";

import slide1 from "../assets/slides/slide01.png";
import slide2 from "../assets/slides/slide02.png";
import slide3 from "../assets/slides/slide03.png";

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE  = 6;

  const [filter, setFilter] = useState({
    category:   searchParams.get("category") || "All",
    term:       searchParams.get("search")   || "",
    priceRange: "all",
    size:       "all",
    color:      "all",
    sort:       "default",
  });

  /* ────────────────────────────────────────────────────────── *
   *  Fetch products (relación category viene cargada)
   * ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
    fetch(`${API_URL}/products`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* ────────────────────────────────────────────────────────── *
   *  Helpers
   * ────────────────────────────────────────────────────────── */
  const getCatName = (p) =>
    (typeof p.category === "object" ? p.category?.name : p.category) || "Other";

  /* ────────────────────────────────────────────────────────── *
   *  Apply filters
   * ────────────────────────────────────────────────────────── */
  let temp = products.filter(p => {
    const cat = getCatName(p);
    return (filter.category === "All" || cat === filter.category) &&
           p.name.toLowerCase().includes(filter.term.toLowerCase());
  });

  // Price
  if (filter.priceRange !== "all") {
    const [min, max] = filter.priceRange.split("-").map(Number);
    temp = temp.filter(p => {
      const price = Number(p.price);
      return price >= min && price <= max;
    });
  }

  // Size
  if (filter.size !== "all") {
    temp = temp.filter(p => (p.size ?? "") === filter.size);
  }

  // Color
  if (filter.color !== "all") {
    temp = temp.filter(p => (p.color ?? "") === filter.color);
  }

  // Sort
  if (filter.sort === "price-asc") {
    temp.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (filter.sort === "price-desc") {
    temp.sort((a, b) => Number(b.price) - Number(a.price));
  }

  const visible        = temp.slice(0, page * ITEMS_PER_PAGE);
  const categoryOrder  = [...new Set(visible.map(getCatName))]; // categorías dinámicas

  /* ────────────────────────────────────────────────────────── *
   *  Render
   * ────────────────────────────────────────────────────────── */
  return (
    <main className="home-wrapper page-wrapper py-8 space-y-12">
      <Carousel slides={[slide1, slide2, slide3]} />

      {/* Tres tarjetas promocionales */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Summer Sale</h3>
          <p className="text-gray-600">Up to 50% off select tees!</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">New Arrivals</h3>
          <p className="text-gray-600">Check out our latest hoodies.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Limited Editions</h3>
          <p className="text-gray-600">Grab them before they’re gone!</p>
        </div>
      </section>

      <Hero />

      <FilterBar filter={filter} onFilter={setFilter} />

      <h1 className="section-title mt-8">Catalog</h1>
      <hr className="my-4 border-gray-200" />

      {loading   && <Spinner />}
      {error     && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && categoryOrder.map(category => {
        const items = visible
          .filter(p => getCatName(p) === category)
          .slice(0, 3);

        return items.length ? (
          <section key={category} className="my-8">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {items.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null;
      })}

      {temp.length > page * ITEMS_PER_PAGE && (
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
