"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "client.name",
    header: "Client Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <span className="font-semibold">{row.original.client.name}</span>
        <Badge variant="outline">{row.original.client.type}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => <div>{formatPrice(row.original.totalPrice)}</div>,
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      return (
        <Badge
          className={
            status === "PAID"
              ? "bg-green-600 hover:bg-green-600"
              : "bg-red-600 hover:bg-red-600"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.createdAt), "PPP HH:mm:ss")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const handleViewOrder = () => {
        router.push(`/orders/${row.original.id}`);
      };

      return (
        <Button variant="outline" size="sm" onClick={handleViewOrder}>
          View Details
        </Button>
      );
    },
  },
];
