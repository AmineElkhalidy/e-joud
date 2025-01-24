"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "./_components/DataTable";
import { formatPrice } from "@/lib/format";
import { format } from "date-fns";
import axios from "axios";
import { generatePDF } from "@/lib/utils";

const storeName = "E-JOUD";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
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
    generatePDF(order, storeName); // Utility to generate and download/print PDF
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Button onClick={handlePrint} className="bg-sky-700 hover:bg-sky-900">
          Print / Download
        </Button>
      </div>

      {/* Order Info */}
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

      {/* Order Summary */}
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

      {/* Purchased Items Table */}
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
          data={order?.purchasedItems}
        />
      </div>
    </div>
  );
};

export default OrderDetailsPage;
