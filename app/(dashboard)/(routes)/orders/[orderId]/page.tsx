import React from "react";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const OrderDetailsPage = async ({
  params,
}: {
  params: { orderId: string };
}) => {
  const { orderId } = await params;

  // ✅ Fetch the purchase details with purchased items and related product data
  const purchase = await db.purchase.findUnique({
    where: { id: orderId },
    include: {
      client: true,
      purchasedItems: {
        include: {
          product: true, // Make sure product data is included
        },
      },
    },
  });

  if (!purchase) {
    return <div>Order not found.</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        Client: {purchase.client?.fullName || "Walk-in Client"}
      </h1>

      <p className="mb-4">
        Payment Status:{" "}
        <Badge
          className={
            purchase.paymentStatus === "PAID" ? "bg-green-600" : "bg-red-600"
          }
        >
          {purchase.paymentStatus === "PAID" ? "PAID" : "UNPAID"}
        </Badge>
      </p>

      {/* ✅ ShadCN Table for purchased items */}
      <div className="mt-6 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Purchase Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchase.purchasedItems.length > 0 ? (
              purchase.purchasedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.product?.name || "Product not found"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {formatPrice(item.price * item.quantity)}
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(purchase.createdAt),
                      "EEEE, dd MMMM yyyy 'à' HH:mm",
                      {
                        locale: fr,
                      }
                    ).replace(/^\w/, (c) => c.toUpperCase())}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No purchased items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="mt-4 font-semibold">
        Total Paid Amount: {formatPrice(purchase.paidAmount)}
      </p>
    </div>
  );
};

export default OrderDetailsPage;
