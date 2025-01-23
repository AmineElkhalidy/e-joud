"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PurchasedItem } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<PurchasedItem>[] = [
  {
    accessorKey: "product.name",
    header: "Product Name",
    cell: ({ row }) => <div>{row.original?.product?.name}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <div>{row.original.price.toFixed(2)} MAD</div>,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.original.quantity}</div>,
  },
  {
    accessorKey: "totalPrice",
    header: "Total Amount",
    cell: ({ row }) => (
      <div>{(row.original.price * row.original.quantity).toFixed(2)} MAD</div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const router = useRouter();
      const handleStatusChange = async (status: "PAID" | "UNPAID") => {
        try {
          // Update payment status in the database
          await axios.patch(
            `/api/purchases/${row.original?.purchaseId}/status`,
            {
              paymentStatus: status,
            }
          );
          toast.success("Payment status updated successfully!");
          router.refresh();
        } catch (error) {
          console.error(error);
          toast.error("Failed to update payment status.");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Badge
                className={`${
                  row.original.paymentStatus === "PAID"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {row.original.paymentStatus}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStatusChange("PAID")}>
              Mark as PAID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("UNPAID")}>
              Mark as UNPAID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const moroccanTime = format(
        new Date(row.original.createdAt),
        "EEEE, d MMM yyyy 'at' HH:mm:ss"
      );

      return <div>{moroccanTime}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      const handleDeletion = () => {};

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <Button variant="secondary" onClick={handleDeletion}>
              <DropdownMenuItem>
                <Trash className="h-4 w-4 mr-2" /> Remove
              </DropdownMenuItem>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
