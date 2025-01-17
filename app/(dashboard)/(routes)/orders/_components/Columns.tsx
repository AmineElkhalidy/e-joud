"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { capitalizeFirstLetter } from "@/lib/utils";

interface Purchase {
  id: string;
  clientName: string;
  purchasedItems: {
    productName: string;
    productQuantity: number;
    remainingCount: number;
  };
  paidAmount: number;
  createdAt: Date;
}

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Client Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "purchasedItems",
    header: "Purchased Items",
    cell: ({ row }) => {
      const { productName, productQuantity, remainingCount } =
        row.getValue("purchasedItems");

      return (
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-gray-800">{productQuantity}</span>
          {`x ${productName}`}
          {remainingCount > 0 && (
            <span className="text-sm text-gray-500 italic">
              + {remainingCount} other item{remainingCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "paidAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Paid Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("paidAmount") || "0");
      return <div className="font-semibold">{formatPrice(amount)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Purchase Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      return (
        <div>
          {capitalizeFirstLetter(
            format(new Date(date), "EEEE, d MMMM yyyy 'à' HH:mm", {
              locale: fr, // ✅ 24-hour format with French locale
            })
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const purchaseId = row.original?.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <Link href={`/orders/${purchaseId}`}>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" /> View order
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
