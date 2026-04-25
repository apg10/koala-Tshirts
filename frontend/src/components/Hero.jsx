import summerSale from "../assets/slides/summer_sale.png";

export default function Hero() {
  return (
    <section className="hero-section">
      <img
        src={summerSale}
        alt="Summer Sale"
        className="hero-bg"
        aria-hidden="true"
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-neutral-900">
          Summer Sale
        </h1>
        <p className="mt-2 text-gray-600 max-w-lg">
          Up to <span className="font-semibold">50% off</span> on select tees – refresh your wardrobe with style.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
          <a href="#catalog" className="btn btn-primary">Browse Catalog</a>
          <a href="#new-arrivals" className="btn btn-secondary">New Arrivals</a>
        </div>
      </div>
    </section>
  );
}
