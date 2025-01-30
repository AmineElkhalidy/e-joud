"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/format";

// ShadCN UI components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DatePickerWithPresets } from "@/components/ui/date-picker";

import {
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  CircleDollarSign,
  Filter,
  ShoppingBag,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface DashProps {
  totalRevenue: number;
  totalSpent: number;
  totalProfit: number;
  totalOrders: number;
  topProducts: { name: string; sales: number }[];
  // Add more fields (like categoryDistribution) if needed.
}

const Dash = ({
  totalRevenue,
  totalSpent,
  totalProfit,
  totalOrders,
  topProducts,
}: DashProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract date filters from URL params
  const [startDate, setStartDate] = useState<Date | null>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null
  );

  // Apply date filters
  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());
    router.push(`/?${params.toString()}`);
  };

  // Clear date filters
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    router.push("/");
  };

  // Check if there's relevant data
  const hasData = totalRevenue > 0 || totalSpent > 0 || totalProfit > 0;

  return (
    <div className="space-y-6">
      {/* Header + Filter Sheet */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-x-2 bg-sky-700 hover:bg-sky-900">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[360px]">
            <SheetHeader>
              <SheetTitle>Date Filters</SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {/* Start Date */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Start Date
                </p>
                <DatePickerWithPresets
                  selectedDate={startDate}
                  onDateChange={setStartDate}
                />
              </div>

              {/* End Date */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  End Date
                </p>
                <DatePickerWithPresets
                  selectedDate={endDate}
                  onDateChange={setEndDate}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={clearFilters}>
                  Reset
                </Button>
                <Button
                  onClick={handleApplyFilter}
                  disabled={!startDate || !endDate}
                  className="bg-sky-700 hover:bg-sky-900"
                >
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Top Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{hasData ? totalOrders : 0}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-x-1 text-[#f59e0b] ">
              <ShoppingBag className="w-4 h-4" /> Number of Orders
            </p>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {hasData ? formatPrice(totalRevenue) : "0.00"}
            </p>
            <p className="text-sm text-green-600 flex items-center gap-x-1">
              <ChevronsUp className="w-4 h-4" /> Total Revenue
            </p>
          </CardContent>
        </Card>

        {/* Spent */}
        <Card>
          <CardHeader>
            <CardTitle>Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {hasData ? formatPrice(totalSpent) : "0.00"}
            </p>
            <p className="text-sm text-red-600 flex items-center gap-x-1">
              <ChevronsDown className="w-4 h-4" /> Total Spent
            </p>
          </CardContent>
        </Card>

        {/* Profit */}
        <Card>
          <CardHeader>
            <CardTitle>Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {hasData ? formatPrice(totalProfit) : "0.00"}
            </p>
            <p className="text-sm text-sky-600 flex items-center gap-x-1">
              <CircleDollarSign className="w-4 h-4" /> Net Profit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Example Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue vs Spent Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Revenue", value: totalRevenue / 1000 },
                    { name: "Spent", value: totalSpent / 1000 },
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top-Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#0369a1" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dash;
