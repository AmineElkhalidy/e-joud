"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

interface Product {
  id: string;
  name: string;
}

interface Props {
  products: Product[];
}

const AddReturnDialog = ({ products }: Props) => {
  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog visibility
  const router = useRouter();

  // Filter products based on the search term
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleSave = async () => {
    if (!productId || !quantity || !reason) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("/api/returns", {
        productId,
        quantity: parseInt(quantity),
        reason,
      });
      toast.success("Return added successfully!");
      router.refresh();
      setProductId("");
      setQuantity("");
      setReason("");
      setSearchTerm("");
      setIsOpen(false); // Close the dialog
    } catch (error) {
      console.error(error);
      toast.error("Failed to add return.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-sky-700 hover:bg-sky-900"
        >
          New Return
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-xl font-semibold mb-4">
          Add New Return
        </DialogTitle>
        <div className="space-y-4">
          {/* Product Select */}
          <div>
            <label className="text-sm font-medium mb-1 block">Product</label>
            <Select onValueChange={(value) => setProductId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Search for a product..." />
              </SelectTrigger>
              <SelectContent>
                {/* Search Input */}
                <div className="p-2">
                  <Input
                    placeholder="Search for a product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Products List */}
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    No products found.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="text-sm font-medium mb-1 block">Quantity</label>
            <Input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Reason Textarea */}
          <div>
            <label className="text-sm font-medium mb-1 block">Reason</label>
            <Textarea
              placeholder="Describe the problem..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-sky-700 hover:bg-sky-900"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddReturnDialog;
