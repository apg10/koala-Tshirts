export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white px-6 py-20 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
          Discover Your Style with <span className="text-blue-600">Koala T-Shirts</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          High-quality, minimalist designs inspired by comfort and nature.
        </p>
        <a
          href="#products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Shop Now
        </a>
      </div>
    </section>    
  );
}
