import React from "react";
import MobileSidebar from "./MobileSidebar";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="p-4 border-b h-full flex items-center justify-between bg-white shadow-sm md:justify-end">
      <MobileSidebar />

      <UserButton />
    </nav>
  );
};

export default Navbar;
