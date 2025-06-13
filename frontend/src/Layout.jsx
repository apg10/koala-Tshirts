import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 text-gray-800 p-4">
        <Outlet />
      </main>
    </>
  );
}
