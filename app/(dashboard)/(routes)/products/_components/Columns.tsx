"use client";

import { Product } from "@prisma/client";
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
import ProductQuantityControl from "./ProductQuantityControl";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formattedPrice = formatPrice(price);

      return <div className="font-semibold">{formattedPrice}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quantity = parseInt(row.getValue("quantity") || "0");
      const productId = row.original.id;

      return (
        <ProductQuantityControl
          initialQuantity={quantity}
          productId={productId}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <Button variant="ghost">Status</Button>;
    },
    cell: ({ row }) => {
      const quantity = parseInt(row.getValue("quantity") || "0");
      return (
        <>
          {quantity === 0 ? (
            <Badge className="bg-red-600 hover:bg-red-600">Out of Stock</Badge>
          ) : (
            <Badge className="bg-green-600 hover:bg-green-600">In Stock</Badge>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const router = useRouter();

      const handleProductEdit = () => {
        router.push(`/products/${id}`);
      };

      return (
        <div className="flex justify-end mr-4">
          <Button variant="outline" size="sm" onClick={handleProductEdit}>
            <Pencil className="h-2 w-2 mr-1" /> Edit
          </Button>
        </div>
      );
    },
  },
];
