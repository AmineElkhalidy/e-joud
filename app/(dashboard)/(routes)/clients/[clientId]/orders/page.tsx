"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "../_components/DataTable";
import { formatPrice } from "@/lib/format";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { generatePDF } from "@/lib/utils";

const storeName = "E-JOUD";

interface HeaderSectionProps {
  onPrint: () => void;
}

interface OrderInfoProps {
  order: any;
}

interface OrderSummaryProps {
  order: any;
}

interface PurchasedItemsTableProps {
  items: any[];
}

const HeaderSection = ({ onPrint }: HeaderSectionProps) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold">Order Details</h1>
    <Button onClick={onPrint} className="bg-sky-700 hover:bg-sky-900">
      Print / Download
    </Button>
  </div>
);

const OrderInfo = ({ order }: OrderInfoProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div>
      <p>
        <strong>Client Name:</strong> {order?.client?.name || "Unknown"}
      </p>
      <p>
        <strong>Client Type:</strong>{" "}
        <Badge>{order?.client?.clientType || "Unknown"}</Badge>
      </p>
    </div>
    <div>
      <p>
        <strong>Order Date:</strong>{" "}
        {format(new Date(order?.createdAt), "PPpp")}
      </p>
      <p>
        <strong>Payment Status:</strong>{" "}
        <Badge
          className={
            order?.paymentStatus === "PAID" ? "bg-green-600" : "bg-red-600"
          }
        >
          {order?.paymentStatus}
        </Badge>
      </p>
    </div>
  </div>
);

const OrderSummary = ({ order }: OrderSummaryProps) => (
  <div className="mb-6">
    <p>
      <strong>Total Price:</strong> {formatPrice(order?.totalPrice)}
    </p>
    <p>
      <strong>Paid Amount:</strong> {formatPrice(order?.paidAmount)}
    </p>
    {order?.paymentStatus === "UNPAID" && (
      <p>
        <strong>Due Amount:</strong>{" "}
        {formatPrice(order?.totalPrice - order?.paidAmount)}
      </p>
    )}
  </div>
);

const PurchasedItemsTable = ({ items }: PurchasedItemsTableProps) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Purchased Items</h2>
    <DataTable
      columns={[
        { accessorKey: "product.name", header: "Product Name" },
        {
          accessorKey: "price",
          header: "Price",
          cell: ({ row }) => formatPrice(row.original.price),
        },
        { accessorKey: "quantity", header: "Quantity" },
        {
          accessorKey: "totalPrice",
          header: "Total Price",
          cell: ({ row }) =>
            formatPrice(row.original.price * row.original.quantity),
        },
      ]}
      data={items}
    />
  </div>
);

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!orderId) {
      toast.error("Invalid order ID.");
      router.push("/orders");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/purchases/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        toast.error("Failed to fetch order details.");
        router.push("/orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  if (isLoading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  const handlePrint = () => {
    generatePDF(order, storeName);
  };

  return (
    <div>
      {/* Header Section */}
      <HeaderSection onPrint={handlePrint} />

      {/* Order Info */}
      <OrderInfo order={order} />

      {/* Order Summary */}
      <OrderSummary order={order} />

      {/* Purchased Items Table */}
      <PurchasedItemsTable items={order?.purchasedItems} />
    </div>
  );
};

export default OrderDetailsPage;
