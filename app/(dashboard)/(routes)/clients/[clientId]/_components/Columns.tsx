"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

// Define purchase item type
interface PurchaseItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: "PAID" | "UNPAID";
}

export const columns: ColumnDef<PurchaseItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formattedPrice = formatPrice(price);

      return <div className="font-semibold">{formattedPrice}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Quantity
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const quantity = parseInt(row.getValue("quantity") || "0");
      return <div className="pl-8">{quantity}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <Button variant="ghost">Status</Button>,
    cell: ({ row }) => {
      const status = row.getValue("status");

      const updateStatus = async (newStatus: "PAID" | "UNPAID") => {
        try {
          // ✅ First, fetch the purchase related to the product
          const purchaseResponse = await axios.get(
            `/api/purchases/by-product/${row.original.id}`
          );

          const purchaseId = purchaseResponse.data.purchaseId;

          if (!purchaseId) {
            toast.error("Purchase not found for this product.");
            return;
          }

          // ✅ Now update the payment status
          await axios.patch(`/api/purchases/${purchaseId}/status`, {
            status: newStatus,
          });

          toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
          console.error("Error updating payment status:", error);
          toast.error("Failed to update payment status");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge
              className={cn(
                "ml-4 cursor-pointer",
                status === "PAID"
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-red-600 hover:bg-red-600"
              )}
            >
              {status}
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {status === "PAID" ? (
              <DropdownMenuItem onClick={() => updateStatus("UNPAID")}>
                Mark as UNPAID
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => updateStatus("PAID")}>
                Mark as PAID
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <Link href={`/products/${id}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
