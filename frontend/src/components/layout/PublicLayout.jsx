import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout() {

  return (
    <div className="min-h-screen flex flex-col bg-background-light">

      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />

    </div>
  );
}
