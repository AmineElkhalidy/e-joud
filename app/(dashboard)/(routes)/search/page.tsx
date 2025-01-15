import React from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import SearchInput from "@/components/SearchInput";
import Categories from "./_components/Categories";
import ProductsList from "@/components/ProductsList";
import { getProducts } from "@/actions/get-products";

export const metadata: Metadata = {
  title: "Search By Category | E-JOUD",
  description: "Search for products by category.",
};

interface Props {
  searchParams: {
    name: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const products = await getProducts({ ...searchParams });

  return (
    <>
      <div className="mb-4 md:hidden md:mb-0 block">
        <SearchInput />
      </div>

      <div className="space-y-4">
        <Categories items={categories} />
        {/* <ProductsList items={products} /> */}
      </div>
    </>
  );
};

export default SearchPage;
