"use client";

import { Category } from "@prisma/client";
import React from "react";
import {
  FcMultipleDevices,
  FcIphone,
  FcFullBattery,
  FcEngineering,
  FcTabletAndroid,
  FcClock,
} from "react-icons/fc";
import { IconType } from "react-icons";
import CategoryItem from "./CategoryItem";

interface Props {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Phones: FcIphone,
  "Afficheurs (LCD, etc...)": FcIphone,
  Accessories: FcEngineering,
  Pcs: FcMultipleDevices,
  Batteries: FcFullBattery,
  Gaming: FcIphone,
  Tablets: FcTabletAndroid,
  Watches: FcClock,
};
const Categories = ({ items }: Props) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-3 ">
      {items.map((item, index) => (
        <CategoryItem
          key={index}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
