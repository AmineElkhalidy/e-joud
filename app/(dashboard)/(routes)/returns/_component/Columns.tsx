"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { Return } from "@prisma/client";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Return>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => <div>{row.original?.product?.name}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.original?.quantity}</div>,
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => <div>{row.original?.reason}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original?.status;
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
        new Date(row.original?.createdAt),
        "EEEE, d MMM yyyy 'at' HH:mm:ss"
      );
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const handleDelete = async () => {
        try {
          await axios.delete(`/api/returns/${row.original.id}`);
          toast.success("Return deleted successfully!");
          router.refresh();
        } catch (error) {
          console.error("Failed to delete return:", error);
          toast.error("Failed to delete return.");
        }
      };

      const handleMarkProcessed = async () => {
        try {
          await axios.patch(`/api/returns/${row.original.id}`, {
            status: "PROCESSED",
          });
          toast.success("Return marked as processed!");
          router.refresh();
        } catch (error) {
          console.error("Failed to process return:", error);
          toast.error("Failed to process return.");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-4 p-0">
              ...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleMarkProcessed}>
              Mark as Processed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete Return
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
