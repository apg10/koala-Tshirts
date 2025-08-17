import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const TYPE_NAMES = ["Long Sleeve","Short Sleeve","Kids"];

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/products/")
      .then(r => setItems(r.data || []))
      .catch(e => setErr(e.message || "Failed to load"))
      .finally(()=>setLoading(false));
  },[]);

  const byType = useMemo(() => {
    const map = Object.fromEntries(TYPE_NAMES.map(t => [t, []]));
    for (const p of items) {
      const name = typeof p?.category === "object" ? (p.category?.name ?? "") : (p?.category ?? "");
      if (TYPE_NAMES.includes(name)) map[name].push(p);
    }
    return map;
  },[items]);

  return (
    <div className="space-y-10">
      <header className="page-wrapper text-center">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-gray-600">Browse by type.</p>
      </header>

      {loading && <div className="flex justify-center py-16"><Spinner/></div>}
      {err && <p className="text-center text-red-600">Error: {err}</p>}

      {!loading && !err && TYPE_NAMES.map(type => (
        <section key={type} className="page-wrapper">
          <h2 className="text-xl font-semibold mb-4">{type}</h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {byType[type]?.length
              ? byType[type].map(p => <ProductCard key={p.id} product={p} />)
              : <p className="text-gray-500">No items in this category yet.</p>
            }
          </div>
        </section>
      ))}
    </div>
  );
}
