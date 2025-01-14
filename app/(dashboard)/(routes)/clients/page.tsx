import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";

export const metadata: Metadata = {
  title: "Clients List | E-JOUD",
  description: "Our clients",
};

const ClientsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const clients = await db.client.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTable columns={columns} data={clients} />;
};

export default ClientsPage;
