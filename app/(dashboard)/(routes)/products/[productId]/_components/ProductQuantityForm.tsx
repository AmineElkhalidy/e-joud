"use client";

import { Product } from "@prisma/client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface Props {
  initialData: Product;
  productId: string;
}

// ✅ Updated schema to include minimumQuantity
const formSchema = z.object({
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be 1 or higher" }),
  minimumQuantity: z.coerce
    .number()
    .min(1, { message: "Minimum quantity must be 1 or higher" }),
});

const ProductQuantityForm = ({ initialData, productId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  // ✅ Set default values for quantity and minimumQuantity
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: initialData?.quantity || undefined,
      minimumQuantity: initialData?.minimumQuantity || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // ✅ Send both quantity and minimumQuantity to the API
      await axios.patch(`/api/products/${productId}`, values);
      toast.success("Product updated successfully!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Product Quantity</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit quantity
            </>
          )}
        </Button>
      </div>

      {/* ✅ Display current quantity and minimum quantity */}
      {!isEditing && (
        <div className="mt-2 space-y-2">
          <p
            className={cn(
              "text-sm",
              !initialData?.quantity && "text-slate-500 italic"
            )}
          >
            {initialData?.quantity
              ? `${initialData?.quantity} ${
                  initialData?.quantity > 1 ? "Pieces" : "Piece"
                }`
              : "No quantity set"}
          </p>

          {/* <p
            className={cn(
              "text-sm",
              !initialData?.minimumQuantity && "text-slate-500 italic"
            )}
          >
            {initialData?.minimumQuantity
              ? `Minimum Stock: ${initialData?.minimumQuantity}`
              : "No minimum quantity set"}
          </p> */}
        </div>
      )}

      {/* ✅ Editing form for quantity and minimumQuantity */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* ✅ Quantity Input */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-muted-foreground">Quantity</Label>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      placeholder="Set product quantity"
                      className="bg-white"
                      {...(field ?? "")}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Minimum Quantity Input */}
            <FormField
              control={form.control}
              name="minimumQuantity"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-muted-foreground">
                    Minimum quantity to trigger 'Out of Stock' alert
                  </Label>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      placeholder="Set minimum stock quantity"
                      className="bg-white"
                      {...(field ?? "")}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ProductQuantityForm;
