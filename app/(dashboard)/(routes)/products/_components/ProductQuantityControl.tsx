"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  initialQuantity: number;
  productId: string;
}

const ProductQuantityControl = ({ initialQuantity, productId }: Props) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const increaseQuantityHandler = async () => {
    try {
      setIsLoading(true);
      const increasedQuantity = quantity + 1;
      const response = await axios.patch(
        `/api/products/${productId}/increase`,
        {
          quantity: increasedQuantity,
        }
      );
      setQuantity(response?.data?.quantity);
      toast.success("Quantity increased!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to increase quantity!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-4">
      <Button
        variant="secondary"
        onClick={increaseQuantityHandler}
        disabled={isLoading}
        className="h-8 w-8 rounded-full duration-300 hover:bg-sky-700 hover:text-white"
      >
        <Plus className="w-4 h-4" />
      </Button>
      <span className="font-semibold">{quantity}</span>
      <Button
        variant="secondary"
        className="h-8 w-8 rounded-full duration-300 hover:bg-red-700 hover:text-white"
      >
        <Minus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ProductQuantityControl;
