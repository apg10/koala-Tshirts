export default function Hero() {
  console.log("HERO COMPACT RENDERED")
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          Discover Your Style with{" "}
          <span className="text-blue-600">Koala&nbsp;T-Shirts</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          High-quality, minimalist designs inspired by comfort and nature.
        </p>
        <a
          href="#products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          Shop&nbsp;Now
        </a>
      </div>
    </section>
  );
}
