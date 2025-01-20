import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";

export const metadata: Metadata = {
  title: "Categories | E-JOUD",
  description: "Categories List",
};

const CategoriesPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // ✅ Fetch categories along with the product count
  const categories = await db.category.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        select: {
          products: true, // Counts the number of products in each category
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // ✅ Map data to include productsNumber
  const formattedCategories = categories.map((category) => ({
    ...category,
    productsNumber: category._count.products, // Add the product count
  }));

  return <DataTable columns={columns} data={formattedCategories} />;
};

export default CategoriesPage;
