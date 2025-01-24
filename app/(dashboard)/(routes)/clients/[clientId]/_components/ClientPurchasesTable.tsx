"use client";

import React, { useState } from "react";
import { DataTable } from "./DataTable";
import { columns } from "./Columns";
import { isSameDay } from "date-fns";
import { DatePickerWithPresets } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

interface Purchase {
  id: string;
  product: { name: string };
  price: number;
  quantity: number;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
}

interface PurchasesTableProps {
  purchases: Purchase[];
}

const ClientPurchasesTable = ({ purchases }: PurchasesTableProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Filter purchases based on the selected date
  const filteredPurchases = selectedDate
    ? purchases.filter((purchase) =>
        isSameDay(new Date(purchase.createdAt), selectedDate)
      )
    : purchases;

  return (
    <div>
      {/* DatePicker Component */}
      <div className="mb-6 flex items-center justify-end gap-x-4">
        <DatePickerWithPresets
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <Button onClick={() => setSelectedDate(null)}>Clear Filter</Button>
      </div>

      {/* DataTable with filtered data */}
      <DataTable columns={columns} data={filteredPurchases} />
    </div>
  );
};

export default ClientPurchasesTable;
