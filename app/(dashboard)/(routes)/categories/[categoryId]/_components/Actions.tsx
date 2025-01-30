"use client";

import React, { useState } from "react";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  categoryId: string;
}

const CategoryActions = ({ categoryId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/categories/${categoryId}`);
      toast.success("Category deleted!");
      router.refresh();
      router.push(`/categories`);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal
        onConfirm={onDelete}
        title="Delete Category?"
        description="Are you sure you want to delete? This action cannot be undone."
      >
        <Button size="sm" disabled={isLoading}>
          <TrashIcon className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default CategoryActions;
