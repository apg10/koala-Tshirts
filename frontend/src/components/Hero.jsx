import summerSale from "../assets/slides/summer_sale.png";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden h-[50vh]">
      {/* Imagen de fondo */}
      <img
        src={summerSale}
        alt="Summer Sale"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Overlay más oscuro para mejor contraste */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Contenido */}
      <div className="relative page-wrapper flex h-full flex-col lg:flex-row items-center justify-center gap-8">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Summer Sale
          </h1>
          <p className="mt-2 text-gray-200 max-w-lg">
            Up to <span className="font-semibold">50% off</span> on select tees—refresh your wardrobe with style.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
            <a href="#catalog" className="btn btn-primary">
              Browse Catalog
            </a>
            <a href="#new-arrivals" className="btn btn-secondary">
              New Arrivals
            </a>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <div className="w-48 h-48 bg-white/10 rounded-2xl flex items-center justify-center">
            <span className="text-sm text-gray-200">Featured Tee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
