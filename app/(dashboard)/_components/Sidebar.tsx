import React from "react";
import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  return (
    <aside className="w-full h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6 border-b flex items-center gap-x-2">
        <span className="text-sky-800 font-bold">E-JOUD</span>
      </div>

      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </aside>
  );
};

export default Sidebar;
