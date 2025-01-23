import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | E-JOUD",
  description: "Orders history",
};

const OrdersPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders History</h1>
    </div>
  );
};

export default OrdersPage;
