import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

const CommonLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
