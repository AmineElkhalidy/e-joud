"use client";

import { Client } from "@prisma/client"; // Update this import if your Client model is defined elsewhere
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("fullName")}</div>;
    },
  },
  {
    accessorKey: "totalDebt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Debt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const debt = parseFloat(row.getValue("totalDebt") || "0");
      return <div className="font-semibold">{formatPrice(debt)}</div>;
    },
  },
  {
    accessorKey: "clientType",
    header: "Client Type",
    cell: ({ row }) => {
      const type = row.getValue("clientType");
      return (
        <Badge
          className={`${
            type === "PROFESSIONAL"
              ? "bg-green-600 hover:bg-green-600"
              : "bg-sky-600 hover:bg-sky-600"
          }`}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      const router = useRouter();

      const handleClientEdit = () => {
        router.push(`/clients/${id}`);
      };

      return (
        <div className="flex justify-end mr-4">
          <Button variant="outline" size="sm" onClick={handleClientEdit}>
            <Pencil className="h-2 w-2 mr-1" /> Edit
          </Button>
        </div>
      );
    },
  },
];
