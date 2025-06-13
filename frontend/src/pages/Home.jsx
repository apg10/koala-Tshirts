import Hero from "../components/Hero";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <>
      <Hero />

      <section id="products" className="px-6 py-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Catalog</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
