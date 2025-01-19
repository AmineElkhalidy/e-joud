"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

interface Props {
  initialQuantity: number;
  productId: string;
}

const ProductQuantityControl = ({ initialQuantity, productId }: Props) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuantity = useDebounce(quantity, 1000);
  const router = useRouter();

  React.useEffect(() => {
    if (debouncedQuantity !== initialQuantity) {
      updateQuantity(debouncedQuantity);
    }
  }, [debouncedQuantity]);

  // ✅ Common function to update quantity in the database
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

  // ✅ Increase Quantity Logic
  const increaseQuantityHandler = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/products/${productId}`, {
        quantity: quantity + 1,
      });

      if (response.status === 200) {
        setQuantity(response.data.quantity);
        toast.success("Quantity increased!");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to increase quantity!");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Decrease Quantity Logic
  const decreaseQuantityHandler = async () => {
    if (isLoading || quantity <= 0) return;

    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/products/${productId}`, {
        quantity: quantity - 1,
      });

      if (response.status === 200) {
        setQuantity(response.data.quantity);
        toast.success("Quantity decreased!");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to decrease quantity!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-2 flex items-center justify-between w-[40%] md:w-[35%] ">
      {/* ✅ Increase Quantity Button */}
      <Button
        variant="secondary"
        disabled={isLoading}
        onClick={increaseQuantityHandler}
        title="Increase Quantity"
        className="h-8 w-8 rounded-full duration-300 hover:bg-sky-700 hover:text-white"
      >
        <Plus className="w-4 h-4" />
      </Button>

      {/* ✅ Quantity Input */}
      <Input
        type="number"
        disabled={isLoading}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="w-12 text-center border-none shadow-none focus-visible:outline-none focus-visible:ring-0 no-arrows"
        title="Enter quantity manually"
      />

      {/* ✅ Decrease Quantity Button */}
      <Button
        variant="secondary"
        disabled={isLoading || quantity <= 0}
        onClick={decreaseQuantityHandler}
        title="Decrease Quantity"
        className={`h-8 w-8 rounded-full duration-300 hover:bg-red-700 hover:text-white ${
          quantity === 0 ? "opacity-0" : "opacity-100"
        }`}
      >
        <Minus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ProductQuantityControl;
