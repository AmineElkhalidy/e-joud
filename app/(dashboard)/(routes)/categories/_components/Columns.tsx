"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  productsNumber: number;
}

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "productsNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Number of Products
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
      const { id, name } = row.original;
      const router = useRouter();
      const [isDeleting, setIsDeleting] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

      // Edit logic
      const handleEdit = () => {
        router.push(`/categories/${id}`);
      };

      // Delete logic
      const handleDelete = async () => {
        try {
          setIsDeleting(true);
          await axios.delete(`/api/categories/${id}`);
          toast.success("Category deleted successfully!");
          router.refresh();
        } catch (error) {
          toast.error("Failed to delete category.");
        } finally {
          setIsDeleting(false);
          setIsModalOpen(false); // Close modal after deletion
        }
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              {/* Open confirmation modal */}
              <DropdownMenuItem
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Confirm Deletion Modal */}
          {isModalOpen && (
            <ConfirmModal
              title="Delete Category?"
              description={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
              onConfirm={handleDelete}
              onCancel={() => setIsModalOpen(false)}
            />
          )}
        </div>
      );
    },
  },
];
