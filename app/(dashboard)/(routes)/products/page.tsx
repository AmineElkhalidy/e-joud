import React from "react";
import type { Metadata } from "next";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Products | E-JOUD",
  description: "Our Products",
};

const ProductsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const products = await db.product.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true, // Include category relation
    },
  });

  const categories = await db.category.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <DataTable columns={columns} data={products} categories={categories} />
  );
};

export default ProductsPage;
