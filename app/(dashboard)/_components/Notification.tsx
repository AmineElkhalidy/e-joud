"use client";

import React, { useState, useEffect } from "react";
import { Bell, AlertCircle, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Notification = () => {
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch low stock products
    const fetchLowStockProducts = async () => {
      try {
        const response = await axios.get("/api/products/low-stock");
        setLowStockProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch low stock products:", error);
      }
    };

    fetchLowStockProducts();
  }, []);

  // Dismiss a specific product notification
  const handleDismiss = (productId: string) => {
    setLowStockProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {lowStockProducts.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
            {lowStockProducts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg">
          <div className="p-4 border-b font-semibold text-gray-800">
            Low Stock Alerts
          </div>
          <ul className="max-h-60 overflow-auto">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <li
                  key={product.id}
                  className="p-4 border-b last:border-none hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {product.quantity} (Min:{" "}
                        {product.minimumQuantity})
                      </p>
                      <button
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="mt-1 text-sm text-blue-500 hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                      <button
                        onClick={() => handleDismiss(product.id)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-sm text-gray-500">
                No low stock products.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
