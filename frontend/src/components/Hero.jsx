import { Link } from "react-router-dom";
import heroImg from "../assets/placeholder.png";   /* usa la imagen que prefieras */

export default function Hero() {
  return (
    <section className="relative h-[60vh]">
      <img src={heroImg} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">Dress Bold. Dress Koala.</h1>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    </section>
  );
}
