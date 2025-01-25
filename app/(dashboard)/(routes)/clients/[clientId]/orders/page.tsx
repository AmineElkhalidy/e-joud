"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "../_components/DataTable";
import { formatPrice } from "@/lib/format";
import { format, isSameDay } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { DatePickerWithPresets } from "@/components/ui/date-picker";
import { handlePrint } from "@/lib/utils";

const ClientOrdersPage = () => {
  const { clientId } = useParams();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [clientDetails, setClientDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set default date to today
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (!clientId) {
      toast.error("Invalid client ID.");
      router.push("/clients");
      return;
    }

    const fetchClientOrders = async () => {
      try {
        const response = await axios.get(`/api/clients/${clientId}/orders`);
        setOrders(response.data.orders);
        setClientDetails(response.data.client);

        // Filter today's orders on initial load
        setFilteredOrders(
          response.data.orders.filter((order) =>
            isSameDay(new Date(order.createdAt), new Date())
          )
        );
      } catch (error) {
        toast.error("Failed to fetch client orders.");
        router.push("/clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientOrders();
  }, [clientId, router]);

  // Filter orders by selected date
  useEffect(() => {
    if (selectedDate) {
      setFilteredOrders(
        orders.filter((order) =>
          isSameDay(new Date(order.createdAt), selectedDate)
        )
      );
    } else {
      setFilteredOrders(orders);
    }
  }, [selectedDate, orders]);

  // Calculate the total price of all orders (not filtered)
  const calculateTotalPrice = () => {
    return orders.reduce((sum, order) => sum + order.totalPrice, 0);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!orders.length) return <p>No orders found for this client.</p>;

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items justify-between mb-6">
          <h1 className="text-2xl font-bold">Client Orders</h1>
          <Button
            onClick={() => handlePrint(filteredOrders, clientDetails, "E-JOUD")}
            className="bg-sky-700 hover:bg-sky-900"
          >
            Print / Download
          </Button>
        </div>

        <div className="font-semibold">
          <p className="flex items-center gap-2">
            Client Name:{" "}
            <Button size="sm" className="font-semibold">
              {clientDetails?.fullName || "Unknown"}
            </Button>
          </p>
          <p className="flex items-center gap-2 mt-2">
            Total Price of All Orders:{" "}
            <Button size="sm" className="font-semibold">
              {formatPrice(calculateTotalPrice())}
            </Button>
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="mt-10">
        <div className="flex items-center justify-between flex-wrap">
          <h2 className="text-lg font-semibold mb-4">Orders List</h2>
          {/* Filters */}
          <div className="flex items-center gap-x-4 mb-6">
            <DatePickerWithPresets
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <Button
              variant="outline"
              onClick={() => setSelectedDate(null)}
              disabled={!selectedDate}
            >
              Clear Filter
            </Button>
          </div>
        </div>

        <DataTable
          columns={[
            {
              accessorKey: "purchasedItems[0].product.name",
              header: "Product Name",
              cell: ({ row }) => {
                const products = row.original.purchasedItems.map(
                  (item) => item.product.name
                );
                return <span>{products.join(", ")}</span>;
              },
            },
            {
              accessorKey: "totalItems",
              header: "Total Items",
              cell: ({ row }) =>
                row.original.purchasedItems.reduce(
                  (total, item) => total + item.quantity,
                  0
                ),
            },
            {
              accessorKey: "totalPrice",
              header: "Total Price",
              cell: ({ row }) => formatPrice(row.original.totalPrice),
            },
            {
              accessorKey: "paymentStatus",
              header: "Payment Status",
              cell: ({ row }) => (
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    row.original.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {row.original.paymentStatus}
                </span>
              ),
            },
            {
              accessorKey: "createdAt",
              header: "Order Date",
              cell: ({ row }) =>
                format(new Date(row.original.createdAt), "PPP HH:mm:ss"),
            },
          ]}
          data={filteredOrders}
        />
      </div>
    </div>
  );
};

export default ClientOrdersPage;
