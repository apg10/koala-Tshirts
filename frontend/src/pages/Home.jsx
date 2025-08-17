import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import slide1 from "../assets/slides/mockup-01.png";
import slide2 from "../assets/slides/mockup-02.png";
import slide3 from "../assets/slides/mockup-03.png";

import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // paginación simple (opcional)
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const [filter, setFilter] = useState({
    category:   searchParams.get("category") || "All",
    term:       searchParams.get("search")   || "",
    priceRange: "all",
    size:       "all",
    color:      "all",
    sort:       "default",
  });

  useEffect(() => {
    setLoading(true);
    api.get("/products/") // el slash final evita 307
      .then(r => setProducts(r.data || []))
      .catch(e => setError(e.message || "Error fetching products"))
      .finally(() => setLoading(false));
  }, []);

  // resetear página cuando cambien filtros
  useEffect(() => { setPage(1); }, [
    filter.category, filter.term, filter.priceRange,
    filter.size, filter.color, filter.sort
  ]);

  const filtered = useMemo(() => {
    let tmp = Array.isArray(products) ? [...products] : [];

    // categoría (acepta string u objeto)
    tmp = tmp.filter(p => {
      const catName = typeof p?.category === "object"
        ? (p.category?.name ?? "")
        : (p?.category ?? "");
      return (filter.category === "All" || catName === filter.category) &&
             (p?.name ?? "").toLowerCase().includes((filter.term ?? "").toLowerCase());
    });

    // precio
    if (filter.priceRange !== "all") {
      const [min, max] = filter.priceRange.split("-").map(Number);
      tmp = tmp.filter(p => {
        const price = Number(p?.price ?? 0);
        return price >= min && price <= max;
      });
    }

    // talla / color
    if (filter.size  !== "all") tmp = tmp.filter(p => (p?.size  ?? "") === filter.size);
    if (filter.color !== "all") tmp = tmp.filter(p => (p?.color ?? "") === filter.color);

    // orden
    if (filter.sort === "price-asc")  tmp.sort((a,b)=> Number(a?.price ?? 0) - Number(b?.price ?? 0));
    if (filter.sort === "price-desc") tmp.sort((a,b)=> Number(b?.price ?? 0) - Number(a?.price ?? 0));

    return tmp;
  }, [products, filter]);

  const visible = useMemo(
    () => filtered.slice(0, page * PER_PAGE),
    [filtered, page]
  );

  return (
    <main className="space-y-16">
      {/* Hero */}
      <Hero />

      {/* Carousel centrado */}
      <section className="page-wrapper">
        <div className="w-full max-w-6xl mx-auto">
          <Carousel slides={[slide1, slide2, slide3]} />
        </div>
      </section>

      {/* Texto de bienvenida */}
      <section className="page-wrapper text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Koala T-Shirts</h2>
          <p className="text-gray-600 leading-relaxed">
            We’re passionate about bringing you high-quality, comfortable apparel that fits your style and values. Explore our curated collection of premium t-shirts—designed with care and crafted for everyday wear.
          </p>
        </div>
      </section>

      {/* Título catálogo */}
      <section id="catalog" className="page-wrapper text-center">
        <div className="inline-block">
          <h1 className="text-3xl font-bold mb-1">Catalog</h1>
          <div className="mx-auto mb-8 h-1 w-24 rounded-full bg-blue-600" />
        </div>
      </section>

      {/* Filtros */}
      <section className="page-wrapper">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
          <FilterBar filter={filter} onFilter={setFilter} />
        </div>
      </section>

      {/* Grid de productos */}
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
            <p className="text-gray-500">Try removing filters or searching something different.</p>
          </div>
        </section>
      )}

      {!loading && !error && visible.length > 0 && (
        <section className="page-wrapper">
          <div
            className="
              grid gap-6 sm:gap-8
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              items-stretch
            "
          >
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Load more */}
      {!loading && filtered.length > page * PER_PAGE && (
        <section className="page-wrapper text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:brightness-95 transition"
          >
            Load More
          </button>
        </section>
      )}
    </main>
  );
}
