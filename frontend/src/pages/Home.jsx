// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

import Carousel    from "../components/Carousel";
import FilterBar   from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import Spinner     from "../components/Spinner";

import slide1 from "../assets/slides/slide01.png";
import slide2 from "../assets/slides/slide02.png";
import slide3 from "../assets/slides/slide03.png";

export default function Home() {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const [filter, setFilter] = useState({
    category:   searchParams.get("category") || "All",
    term:       searchParams.get("search")   || "",
    priceRange: "all",
    size:       "all",
    color:      "all",
    sort:       "default",
  });

  /* -------- fetch products -------- */
  useEffect(() => {
    api.get("/products")
       .then(r => setProducts(r.data))
       .catch(e => setError(e.message))
       .finally(() => setLoading(false));
  }, []);

  /* -------- helpers -------- */
  const getCat = (p) =>
    (typeof p.category === "object" ? p.category?.name : p.category) || "Other";

  /* -------- filtering -------- */
  let tmp = products.filter(p => {
    const cat = getCat(p);
    return (filter.category === "All" || cat === filter.category) &&
           p.name.toLowerCase().includes(filter.term.toLowerCase());
  });

  if (filter.priceRange !== "all") {
    const [min,max] = filter.priceRange.split("-").map(Number);
    tmp = tmp.filter(p => {
      const price = +p.price;
      return price >= min && price <= max;
    });
  }
  if (filter.size !== "all")   tmp = tmp.filter(p => (p.size   ?? "") === filter.size);
  if (filter.color !== "all")  tmp = tmp.filter(p => (p.color  ?? "") === filter.color);

  if (filter.sort === "price-asc")  tmp.sort((a,b)=>+a.price - +b.price);
  if (filter.sort === "price-desc") tmp.sort((a,b)=>+b.price - +a.price);

  const visible    = tmp.slice(0, page * PER_PAGE);
  const catOrder   = [...new Set(visible.map(getCat))];

  /* -------- UI -------- */
  return (
    <main className="page-wrapper py-8 space-y-12">
      {/* Hero carrusel */}
      <Carousel slides={[slide1, slide2, slide3]} />

      {/* Tarjetas promocionales */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ["Summer Sale",   "Up to 50% off select tees!"],
          ["New Arrivals",  "Check out our latest hoodies."],
          ["Limited Editions", "Grab them before they’re gone!"],
        ].map(([t,s]) => (
          <div key={t} className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">{t}</h3>
            <p className="text-gray-600">{s}</p>
          </div>
        ))}
      </section>

      {/* Filtros */}
      <FilterBar filter={filter} onFilter={setFilter} />

      <h1 className="text-2xl md:text-3xl font-bold text-center mt-8">Catalog</h1>
      <hr className="my-4 border-gray-200" />

      {loading && <Spinner />}
      {error   && <p className="text-center text-red-600">Error: {error}</p>}

      {!loading && !error && catOrder.map(cat => {
        const items = visible.filter(p => getCat(p) === cat).slice(0,3);
        return items.length ? (
          <section key={cat} className="my-8">
            <h2 className="text-xl font-semibold mb-4">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {items.map(prod => (
                <ProductCard key={prod.id} product={prod}/>
              ))}
            </div>
          </section>
        ) : null;
      })}

      {tmp.length > page * PER_PAGE && (
        <div className="text-center my-8">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2 rounded-full bg-blue-600 text-white
                       hover:bg-blue-700 active:scale-95 transition"
          >
            Load More
          </button>
        </div>
      )}
    </main>
  );
}
