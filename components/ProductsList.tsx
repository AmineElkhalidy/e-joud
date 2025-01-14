import React from "react";
import { Category, Product } from "@prisma/client";
import ProductCard from "@/components/ProductCard";

type CourseWithProgressWithCategory = Product & {
  category: Category | null;
};

interface Props {
  items: CourseWithProgressWithCategory[];
}

const ProductsList = ({ items }: Props) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <ProductCard
            key={index}
            id={item.id}
            name={item.name}
            price={item.price!}
            category={item?.category?.name!}
          />
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-10">
          No products found!
        </p>
      )}
    </div>
  );
};

export default ProductsList;
