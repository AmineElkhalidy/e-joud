"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, CornerDownRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Props {
  initialQuantity: number;
  productId: string;
  minimumPrice: number;
}

const ProductQuantityControl = ({
  initialQuantity,
  productId,
  minimumPrice,
}: Props) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [clientName, setClientName] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(0);

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

  const clearFormFields = () => {
    setClientName("");
    setPurchaseQuantity(1);
    setPurchasePrice(0);
  };

  const handlePurchase = async () => {
    if (!userId) {
      toast.error("User not authenticated.");
      return;
    }

    if (purchaseQuantity <= 0 || purchasePrice <= 0 || !clientName) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    if (purchasePrice < minimumPrice) {
      toast.error(`Price is lower than Min Price.`);
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post("/api/purchases", {
        productId,
        userId,
        clientType: "REGULAR",
        clientName,
        clientId: null,
        quantity: purchaseQuantity,
        price: purchasePrice,
      });

      if (response.status === 200) {
        toast.success("Purchase recorded and stock updated!");
        setQuantity((prev) => prev - purchaseQuantity);
        setIsDialogOpen(false); // ✅ Close the dialog
        clearFormFields(); // ✅ Clear input fields after successful purchase
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
        onChange={handleBulkUpdate}
        className="w-12 text-center border-none shadow-none focus-visible:outline-none focus-visible:ring-0 no-arrows"
        title="Enter quantity manually"
      />

      {/* ✅ Decrease Quantity Button with Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            disabled={quantity <= 0}
            title="Purchase Product"
            className={`h-8 w-8 rounded-full duration-300 hover:bg-sky-700 hover:text-white ${
              quantity === 0 ? "opacity-0" : "opacity-100"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>

          {/* ✅ Client Full Name */}
          <div className="space-y-2">
            <Label>Client Full Name</Label>
            <Input
              type="text"
              placeholder="Enter client full name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* ✅ Purchase Quantity */}
          <div className="space-y-2 mt-4">
            <Label>Purchase Quantity</Label>
            <Input
              type="number"
              placeholder="Enter quantity"
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(parseInt(e.target.value))}
              disabled={isLoading}
              min={1}
            />
          </div>

          {/* ✅ Purchase Price */}
          <div className="space-y-2 mt-4">
            <Label>Purchase Price</Label>
            <Input
              type="number"
              placeholder={`Price (Min: ${minimumPrice})`}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
              disabled={isLoading}
              min={0}
            />
            <p className="text-xs flex items-center gap-1 text-muted-foreground">
              <CornerDownRight size="12" />
              <span>
                Min Price:{" "}
                <span className="text-red-600">{minimumPrice} MAD</span>
              </span>
            </p>
          </div>

          <DialogFooter className="mt-4 flex gap-2 md:gap-0">
            {/* ✅ Cancel Button */}
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                clearFormFields(); // ✅ Clear form when canceled
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>

            {/* ✅ Save Button */}
            <Button onClick={handlePurchase} disabled={isLoading}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductQuantityControl;
