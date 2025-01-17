import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";

const OrdersPage = async () => {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const purchases = await db.purchase.findMany({
    where: { userId },
    include: {
      client: true,
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

  // ✅ Group purchases by client
  const groupedPurchases = purchases.reduce((acc, purchase) => {
    const clientId = purchase.clientId || "walk-in-client";

    if (!acc[clientId]) {
      acc[clientId] = {
        clientName: purchase.client?.fullName || "Walk-in Client",
        items: {},
        latestPurchaseDate: purchase.createdAt,
        totalPaidAmount: 0,
        purchaseId: purchase.id, // ✅ Include the purchase ID
      };
    }

    // ✅ Update latest purchase date if newer
    if (purchase.createdAt > acc[clientId].latestPurchaseDate) {
      acc[clientId].latestPurchaseDate = purchase.createdAt;
    }

    // ✅ Sum up total paid amount
    acc[clientId].totalPaidAmount += purchase.paidAmount;

    // ✅ Aggregate purchased items
    purchase.purchasedItems.forEach((item) => {
      const productName = item.product.name;
      acc[clientId].items[productName] =
        (acc[clientId].items[productName] || 0) + item.quantity;
    });

    return acc;
  }, {} as Record<string, any>);

  // ✅ Format data for the table
  const formattedPurchases = Object.entries(groupedPurchases).map(
    ([clientId, clientData]) => {
      const itemsArray = Object.entries(clientData.items);
      const [firstProductName, firstProductQty] = itemsArray[0];
      const remainingItemsCount = itemsArray.length - 1;

      return {
        id: clientData.purchaseId, // ✅ Correct Purchase ID
        clientName: clientData.clientName,
        purchasedItems: {
          productName: firstProductName,
          productQuantity: firstProductQty,
          remainingCount: remainingItemsCount,
        },
        paidAmount: clientData.totalPaidAmount,
        createdAt: clientData.latestPurchaseDate,
      };
    }
  );

  return <DataTable columns={columns} data={formattedPurchases} />;
};

export default OrdersPage;
