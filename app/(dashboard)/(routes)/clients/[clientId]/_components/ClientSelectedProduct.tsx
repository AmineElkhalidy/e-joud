"use client";

import React, { useState, useMemo } from "react";
import type { ClientType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Category {
  name: string;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  minimumPrice: number;
  professionalMinimumPrice: number;
  quantity: number;
  category?: Category;
}

interface Props {
  clientId: string;
  products: Product[];
  clientType: ClientType;
}

const ClientSelectedProduct = ({ clientId, products, clientType }: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState<string>(""); // Dynamically set based on selected product
  const [quantity, setQuantity] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  // Compute the minimum price dynamically based on the client type and selected product
  const minimumPrice = useMemo(() => {
    if (!selectedProduct) return null;
    return clientType === "PROFESSIONAL"
      ? selectedProduct.professionalMinimumPrice
      : selectedProduct.minimumPrice;
  }, [selectedProduct, clientType]);

  // Organize products by category and filter based on search term
  const categorizedProducts = useMemo(() => {
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredProducts.reduce(
      (acc: Record<string, Product[]>, product) => {
        const categoryName = product.category?.name || "Uncategorized";
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(product);
        return acc;
      },
      {}
    );
  }, [products, searchTerm]);

  const handleSave = async () => {
    if (!selectedProduct || price === "" || quantity === "") {
      toast.error("Please fill out all fields.");
      return;
    }

    const numericPrice = parseFloat(price);
    const numericQuantity = parseInt(quantity);

    if (minimumPrice && numericPrice < minimumPrice) {
      toast.error(`Price must be at least ${minimumPrice} MAD.`);
      return;
    }

    if (numericQuantity > selectedProduct.quantity) {
      toast.error(
        `Only ${selectedProduct.quantity} units of ${selectedProduct.name} are available in stock.`
      );
      return;
    }

    try {
      await axios.post(`/api/purchases`, {
        clientId,
        productId: selectedProduct.id,
        price: numericPrice,
        quantity: numericQuantity,
      });
      toast.success("Purchase added successfully!");

      // Clear all inputs
      setSelectedProduct(null);
      setPrice("");
      setQuantity("1");
      setSearchTerm(""); // Optionally clear the search term
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add purchase!");
    }
  };

  const handleProductSelection = (productId: string) => {
    const product =
      products.find((product) => product.id === productId) || null;
    setSelectedProduct(product);
    if (product) setPrice(product.price.toString());
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <h3 className="text-lg font-medium">Select the product</h3>

      <div className="grid md:grid-cols-3 gap-4 mt-4 items-start">
        {/* Product Selection */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Product</label>
          <Select onValueChange={handleProductSelection}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {/* Search Input */}
              <div className="p-2">
                <Input
                  placeholder="Search for a product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white"
                />
              </div>
              {/* Products List */}
              {Object.keys(categorizedProducts).map((category) => (
                <React.Fragment key={category}>
                  <div className="text-sm font-bold px-2 py-1">{category}</div>
                  {categorizedProducts[category].map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <span className="ml-4">{product.name}</span>
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Price Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Price</label>
          <div className="flex flex-col h-20">
            <Input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-white"
            />
            {minimumPrice !== null && (
              <span className="text-xs text-muted-foreground mt-1">
                Minimum price:{" "}
                <span className="text-red-600">{minimumPrice} MAD</span>
              </span>
            )}
          </div>
        </div>

        {/* Product Quantity Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Quantity</label>
          <div className="flex flex-col h-20">
            <Input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-white"
            />
            {selectedProduct && (
              <span className="text-xs text-muted-foreground mt-1">
                Available: {selectedProduct.quantity} units
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSave}
          className="bg-sky-700 hover:bg-sky-900"
          disabled={!selectedProduct || !price || !quantity}
        >
          Add Purchase
        </Button>
      </div>
    </div>
  );
};

export default ClientSelectedProduct;
