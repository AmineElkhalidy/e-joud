import React from "react";
import type { Metadata } from "next";
import { DataTable } from "./_component/DataTable";
import { columns } from "./_component/Columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AddReturnDialog from "./_component/AddReturnDialog";

export const metadata: Metadata = {
  title: "Returns | E-JOUD",
  description: "Products for Return",
};

const ReturnsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  // Fetch returns with related product information
  const returns = await db.return.findMany({
    where: {
      product: {
        userId,
      },
    },
    include: {
      product: true, // Include product details
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch products for the Add Return dialog
  const products = await db.product.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Flatten returns data
  const flattenedReturns = returns.map((returnItem) => ({
    id: returnItem.id,
    productName: returnItem.product?.name || "Unknown", // Flattened product name
    quantity: returnItem.quantity,
    reason: returnItem.reason,
    status: returnItem.status,
    createdAt: returnItem.createdAt,
  }));

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-12 md:gap-0">
        <h1 className="text-2xl font-semibold">Products for Return</h1>
        <AddReturnDialog products={products} />
      </div>

      {/* Pass flattened data to the table */}
      <DataTable columns={columns} data={flattenedReturns} />
    </div>
  );
};

export default ReturnsPage;
