import React from "react";
import type { Metadata } from "next";
import Orders from "./_components/Orders";

export const metadata: Metadata = {
  title: "Orders | E-JOUD",
  description: "Orders history",
};

const OrdersPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders History</h1>

      <Orders />
    </div>
  );
};

export default OrdersPage;
