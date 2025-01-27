"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "productName", // Flattened key
    header: ({ column }) => {
      return (
        <button
          className="text-left font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
        </button>
      );
    },
    cell: ({ row }) => <div>{row.original.productName}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.original.quantity}</div>,
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => <div>{row.original.reason}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={`${
            status === "PENDING"
              ? "bg-yellow-500"
              : status === "PROCESSED"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const formattedDate = format(
        new Date(row.original.createdAt),
        "EEEE, d MMM yyyy 'at' HH:mm:ss"
      );
      return <div>{formattedDate}</div>;
    },
  },
];
