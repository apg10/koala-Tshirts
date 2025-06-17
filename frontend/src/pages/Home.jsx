import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/products");
        const data = await res.json();
        console.log("[API] Products fetched:", data);
        setProducts(data);
      } catch (err) {
        console.error("[API] Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Agrupar categorías por nombre (aunque category sea objeto)
  const categories = [
    ...new Set(
      products.map((p) =>
        typeof p.category === "object" ? p.category.name : p.category || "Uncategorized"
      )
    ),
  ];

  return (
    <>
      <Hero />

      <section id="products" className="px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Catalog</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="max-w-7xl mx-auto space-y-16">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">{category}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products
                    .filter((p) =>
                      (typeof p.category === "object"
                        ? p.category.name
                        : p.category) === category
                    )
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
