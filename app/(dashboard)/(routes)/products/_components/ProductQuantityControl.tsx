"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TooltipComponent from "@/components/providers/Tooltip";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@clerk/nextjs";

interface Props {
  initialQuantity: number;
  productId: string;
}

const ProductQuantityControl = ({ initialQuantity, productId }: Props) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuantity = useDebounce(quantity, 1000);
  const router = useRouter();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (debouncedQuantity !== initialQuantity) {
      updateQuantity(debouncedQuantity);
    }
  }, [debouncedQuantity]);

  const updateQuantity = async (newQuantity: number) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/products/${productId}`, {
        quantity: newQuantity,
      });
      setQuantity(response?.data?.quantity);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update quantity!");
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQuantityHandler = () => {
    toast.success("Quantity updated!");
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantityHandler = async () => {
    if (quantity <= 0) return;

    if (!userId) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      setIsLoading(true);

      // 2. Trigger backend to record purchase
      const response = await axios.post("/api/purchases", {
        productId,
        userId,
        clientType: "REGULAR",
        clientId: null,
        quantity: 1,
        price: undefined,
      });

      if (response.status === 200) {
        toast.success("Purchase recorded and stock updated!");
        // 1. Decrease quantity locally for UI feedback
        setQuantity((prev) => prev - 1);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to register purchase.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="ml-2 flex items-center justify-between w-[40%] md:w-[35%] ">
      <Button
        variant="secondary"
        disabled={isLoading}
        onClick={increaseQuantityHandler}
        className="h-8 w-8 rounded-full duration-300 hover:bg-sky-700 hover:text-white"
      >
        <TooltipComponent text="Increase stock">
          <Plus className="w-4 h-4" />
        </TooltipComponent>
      </Button>
      <Input
        type="number"
        disabled={isLoading}
        value={quantity}
        onChange={handleBulkUpdate}
        className="w-12 text-center border-none shadow-none focus-visible:outline-none focus-visible:ring-0 no-arrows"
        title="Enter quantity manually"
      />
      <Button
        variant="secondary"
        disabled={isLoading}
        onClick={decreaseQuantityHandler}
        className={`h-8 w-8 rounded-full duration-300 hover:bg-red-700 hover:text-white ${
          quantity === 0 && "opacity-0"
        }`}
      >
        <TooltipComponent text="Decrease stock">
          <Minus className="w-4 h-4" />
        </TooltipComponent>
      </Button>
    </div>
  );
};

export default ProductQuantityControl;
