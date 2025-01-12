"use client";

import React, { useState } from "react";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/useConfettiStore";

interface Props {
  disabled: boolean;
  productId: string;
}

const ProductActions = ({ disabled, productId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const clicked = async () => {
    try {
      setIsLoading(true);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/products/${productId}`);
      toast.success("Product deleted!");
      router.refresh();
      router.push(`/products`);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <TrashIcon className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ProductActions;
