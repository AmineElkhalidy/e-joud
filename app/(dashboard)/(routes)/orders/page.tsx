import React from "react";
import type { Metadata } from "next";
import Orders from "./_components/Orders";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Orders | E-JOUD",
  description: "Orders history",
};

const OrdersPage = async () => {
  // Fetch all orders grouped by client
  const rawOrders = await db.purchase.findMany({
    include: {
      client: true,
      purchasedItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Aggregate orders by client
  const aggregatedOrders = Object.values(
    rawOrders.reduce((acc, order) => {
      const clientId = order.client?.id || "unknown";

      // If the client already exists in the accumulator
      if (acc[clientId]) {
        acc[clientId].totalPrice += order.totalPrice;
        acc[clientId].totalItems += order.purchasedItems?.length || 0;
      } else {
        // If this is the first order for the client
        acc[clientId] = {
          id: order.id, // Keep the ID of the last order
          client: {
            id: clientId,
            name: order.client?.fullName || "Unknown",
            type: order.client?.clientType || "Unknown",
          },
          totalPrice: order.totalPrice,
          totalItems: order.purchasedItems?.length || 0,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
        };
      }

      return acc;
    }, {} as Record<string, any>)
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-8">Orders History</h1>

      {/* Pass aggregated orders to the Orders component */}
      <Orders initialOrders={aggregatedOrders} />
    </div>
  );
};

export default OrdersPage;
