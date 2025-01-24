import React from "react";
import MobileSidebar from "./MobileSidebar";
import { UserButton } from "@clerk/nextjs";
import Notification from "./Notification";

const Navbar = () => {
  return (
    <nav className="p-4 border-b h-full flex items-center justify-between bg-white shadow-sm md:justify-end">
      <MobileSidebar />

      <div className="flex items-center gap-2 md:gap-4">
        <Notification />
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
