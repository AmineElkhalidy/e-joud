import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientNameForm from "./_components/ClientNameForm";
import ClientActions from "./_components/ClientActions";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";
import ClientSelectedProduct from "./_components/ClientSelectedProducts";

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

  const purchases = await db.purchase.findMany({
    where: {
      clientId,
    },
    include: {
      purchasedItems: {
        include: {
          product: true, // Get product details
        },
      },
    },
  });

  if (!client) return redirect("/clients");

  // Flatten purchased items for the DataTable
  const purchasedItems = purchases.flatMap((purchase) =>
    purchase.purchasedItems.map((item) => ({
      id: item.id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      status: purchase.paymentStatus,
    }))
  );

  return (
    <div>
      <div className="flex justify-end mt-4">
        <ClientActions clientId={clientId} />
      </div>
      <div>
        <ClientNameForm initialData={client} clientId={clientId} />
      </div>

      <div>
        <ClientSelectedProduct clientId={clientId} />
      </div>

      <div className="mt-10">
        <h4 className="mb-2 font-medium">
          Purchased items by {client?.fullName}:
        </h4>
        <DataTable
          columns={columns}
          data={purchasedItems}
          clientId={clientId}
        />
      </div>
    </div>
  );
};

export default ClientDetailsPage;
