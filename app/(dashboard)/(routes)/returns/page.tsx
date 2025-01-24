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

  const returns = await db.return.findMany({
    where: {
      product: {
        userId,
      },
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const products = await db.product.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-12 md:gap-0">
        <h1 className="text-2xl font-semibold">Products for Return</h1>
        <AddReturnDialog products={products} />
      </div>

      <DataTable columns={columns} data={returns} />
    </div>
  );
};

export default ReturnsPage;
