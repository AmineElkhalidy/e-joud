import React from "react";
import type { Metadata } from "next";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns"; // New columns file
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Clients | E-JOUD",
  description: "Our Clients",
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
      fullName: "asc",
    },
  });

  return <DataTable columns={columns} data={clients} />;
};

export default ClientsPage;
