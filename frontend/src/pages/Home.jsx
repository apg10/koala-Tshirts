import Hero from "../components/Hero";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  // Agrupar productos por categoría
  const categories = [...new Set(products.map(p => p.category))];

  console.log("[HOME] Loaded products:", products);
  console.log("[HOME] Categories detected:", categories);

  return (
    <>
      <Hero />

      <section id="products" className="px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Catalog</h1>

        <div className="max-w-7xl mx-auto space-y-16">
          {categories.map((category) => {
            console.log(`[HOME] Rendering category: ${category}`);
            const filtered = products.filter((product) => product.category === category);
            return (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">{category}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
