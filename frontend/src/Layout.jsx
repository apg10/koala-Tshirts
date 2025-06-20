import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
