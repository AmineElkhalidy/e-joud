"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DatePickerWithPresets } from "@/components/ui/date-picker";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DashProps {
  totalRevenue: number;
  totalOrders: number;
  topProducts: { name: string; sales: number }[];
  categoryDistribution: { name: string; value: number }[];
}

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

const Dash = ({
  totalRevenue,
  totalOrders,
  topProducts,
  categoryDistribution,
}: DashProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract dates from URL params
  const [startDate, setStartDate] = useState<Date | null>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null
  );

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());

    router.push(`/?${params.toString()}`, { shallow: true });
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    router.push("/", { shallow: true });
  };

  const hasData = totalRevenue > 0 || totalOrders > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-10">Analytics</h1>

      {/* Date Filters */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-muted-foreground">
          <Label>Start Date:</Label>
          <DatePickerWithPresets
            selectedDate={startDate}
            onDateChange={setStartDate}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-muted-foreground">
          <Label>End Date:</Label>
          <DatePickerWithPresets
            selectedDate={endDate}
            onDateChange={setEndDate}
          />
        </div>

        <Button
          className="px-4 py-2 bg-sky-700 text-white duration-300 hover:bg-sky-900"
          onClick={handleApplyFilter}
          disabled={!startDate || !endDate}
        >
          Apply Filter
        </Button>

        <Button
          variant="secondary"
          className="px-4 py-2"
          onClick={clearFilters}
        >
          Clear Filter
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {hasData ? formatPrice(totalRevenue) : "No data yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {hasData ? totalOrders : "No data yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Top-Selling Products */}
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

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {categoryDistribution.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
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
