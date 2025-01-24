"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

// ✅ Define category type with productsNumber
interface Category {
  id: string;
  name: string;
  productsNumber: number;
}

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "productsNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number of Products
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("productsNumber");
      return (
        <div className="ml-16">
          <Badge>{count}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const router = useRouter();

      const handleCategoryEdit = () => {
        router.push(`/categories/${id}`);
      };

      return (
        <div className="flex justify-end mr-4">
          <Button variant="outline" size="sm" onClick={handleCategoryEdit}>
            <Pencil className="h-2 w-2 mr-1" /> Edit
          </Button>
        </div>
      );
    },
  },
];
