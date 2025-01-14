"use client";

import { BarChart, Compass, Layout, List, UserPen, Users } from "lucide-react";
import SidebarItem from "./SidebarItem";

const routes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
  {
    icon: List,
    label: "Products",
    href: "/products",
  },
  {
    icon: Users,
    label: "Clients",
    href: "/clients",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/analytics",
  },
];

const SidebarRoutes = () => {
  return (
    <div className="flex flex-col w-full">
      {routes.map((route, index) => (
        <SidebarItem
          key={index}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
