"use client";

import {
  BarChart,
  Layout,
  List,
  Users,
  Layers,
  ShoppingCart,
  Undo2,
  CircleUser,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

const routes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Layers,
    label: "Categories",
    href: "/categories",
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
    icon: Undo2,
    label: "Returns",
    href: "/returns",
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/orders",
  },
  {
    icon: CircleUser,
    label: "Profiles",
    href: "/profiles",
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
