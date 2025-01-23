import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientNameForm from "./_components/ClientNameForm";
import ClientTypeForm from "./_components/ClientTypeForm";
import ClientSelectedProduct from "./_components/ClientSelectedProduct";
import Actions from "./_components/Actions";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";

const ClientDetailsPage = async ({
  params,
}: {
  params: { clientId: string };
}) => {
  const { clientId } = await params;
  const { userId } = await auth();

  if (!userId) return redirect("/clients");

  const client = await db.client.findUnique({
    where: {
      id: clientId,
    },
  });

  if (!client) return redirect("/clients");

  const products = await db.product.findMany({
    include: {
      category: true,
    },
  });

  // Fetch purchases for the current client
  const purchases = await db.purchase.findMany({
    where: {
      clientId,
    },
    include: {
      purchasedItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Flatten purchases data for the table
  const flattenedPurchases = purchases.flatMap((purchase) =>
    purchase.purchasedItems.map((item) => ({
      ...item,
      paymentStatus: purchase.paymentStatus,
    }))
  );

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold">Client setup</h1>
          </div>

          <Actions clientId={clientId} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <ClientNameForm initialData={client} clientId={clientId} />
          <ClientTypeForm
            clientId={clientId}
            initialType={client?.clientType}
          />
        </div>

        <div className="mt-6">
          <ClientSelectedProduct
            clientId={clientId}
            clientType={client?.clientType}
            products={products}
          />
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-medium mb-4">Orders History</h2>
          <DataTable columns={columns} data={flattenedPurchases} />
        </div>
      </div>
    </>
  );
};

export default ClientDetailsPage;
