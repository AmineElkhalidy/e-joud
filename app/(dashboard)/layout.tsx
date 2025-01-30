import React from "react";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <header className="h-[72.5px] md:pl-60 fixed inset-y-0 w-full z-50">
        <Navbar />
      </header>

      <div className="hidden md:flex h-full w-60 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      <main className="md:pl-60 pt-[80px] h-full">
        <section className="p-4 md:p-6">{children}</section>
      </main>
    </div>
  );
};

export default Layout;
