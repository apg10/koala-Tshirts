// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import slide1 from "../assets/slides/slide01.png";
import slide2 from "../assets/slides/slide02.png";
import slide3 from "../assets/slides/slide03.png";

import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [page, setPage]         = useState(1);
  const PER_PAGE = 8;

  const [filter, setFilter] = useState({
    category:   searchParams.get("category") || "All",
    term:       searchParams.get("search")   || "",
    priceRange: "all",
    size:       "all",
    color:      "all",
    sort:       "default",
  });

  useEffect(() => {
    api.get("/products")
       .then(r => setProducts(r.data))
       .catch(e => setError(e.message))
       .finally(() => setLoading(false));
  }, []);

  let tmp = products.filter(p => {
    const cat = typeof p.category === "object" ? p.category.name : p.category;
    return (filter.category === "All" || cat === filter.category) &&
           p.name.toLowerCase().includes(filter.term.toLowerCase());
  });

  if (filter.priceRange !== "all") {
    const [min, max] = filter.priceRange.split("-").map(Number);
    tmp = tmp.filter(p => {
      const price = +p.price;
      return price >= min && price <= max;
    });
  }
  if (filter.size !== "all")  tmp = tmp.filter(p => (p.size ?? "") === filter.size);
  if (filter.color !== "all") tmp = tmp.filter(p => (p.color ?? "") === filter.color);
  if (filter.sort === "price-asc")  tmp.sort((a,b)=>+a.price - +b.price);
  if (filter.sort === "price-desc") tmp.sort((a,b)=>+b.price - +a.price);

  const visible = tmp.slice(0, page * PER_PAGE);

  return (
    <main className="space-y-16">
      {/* Hero */}
      <Hero />

      {/* Carousel */}
      <section className="page-wrapper">
        <Carousel slides={[slide1, slide2, slide3]} />
      </section>

      {/* Welcome message */}
      <section className="page-wrapper text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome to Koala T-Shirts
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We’re passionate about bringing you high-quality, comfortable apparel that fits your style and values. Explore our curated collection of premium t-shirts—designed with care and crafted for everyday wear.
          </p>
        </div>
      </section>

      {/* Catalog title */}
      <section id="catalog" className="page-wrapper text-center">
        <div className="inline-block">
          <h1 className="text-3xl font-bold mb-1">Catalog</h1>
          <div className="section-divider mx-auto mb-8" />
        </div>
      </section>

      {/* FilterBar */}
      <section className="page-wrapper">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 filter-wrapper">
          <FilterBar filter={filter} onFilter={setFilter} />
        </div>
      </section>

      {/* Product Grid */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}
      {error && (
        <p className="text-center text-red-600">Error: {error}</p>
      )}
      {!loading && !error && visible.length === 0 && (
        <section className="page-wrapper">
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-2">No products found</p>
            <p className="text-gray-500">
              Try removing filters or searching something different.
            </p>
          </div>
        </section>
      )}
      {!loading && !error && visible.length > 0 && (
        <section className="page-wrapper">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">

            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Load More */}
      {!loading && tmp.length > page * PER_PAGE && (
        <section className="page-wrapper text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow hover:brightness-95 transition"
          >
            Load More
          </button>
        </section>
      )}

      <div id="new-arrivals" />
    </main>
  );
}
