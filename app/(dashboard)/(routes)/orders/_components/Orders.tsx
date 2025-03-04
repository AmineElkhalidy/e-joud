"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "./DataTable";
import { columns } from "./Columns";
import { DatePickerWithPresets } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  client: { id: string; name: string; type: string };
  totalItems: number;
  totalPrice: number;
  paymentStatus: "PAID" | "UNPAID";
  createdAt: string;
}

interface OrdersProps {
  initialOrders: Order[];
}

const Orders = ({ initialOrders }: OrdersProps) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    "ALL" | "PAID" | "UNPAID"
  >("ALL");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Filter orders
  React.useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (paymentStatusFilter !== "ALL") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === paymentStatusFilter
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.createdAt).toDateString() ===
          selectedDate.toDateString()
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, paymentStatusFilter, selectedDate, orders]);

  return (
    <div>
      {/* Filters */}
      <div className="w-full flex flex-wrap items-center xl:justify-between gap-4 mb-4">
        <Input
          placeholder="Search by client name or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <DatePickerWithPresets
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <Select
          onValueChange={(value) =>
            setPaymentStatusFilter(value as "ALL" | "PAID" | "UNPAID")
          }
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Filter by payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <DataTable columns={columns} data={filteredOrders} />
    </div>
  );
};

export default Orders;
