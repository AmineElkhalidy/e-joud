"use client";

import React, { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import { formatPrice } from "@/lib/format";

interface Props {
  initialData: Product;
  productId: string;
}

// ✅ Updated schema to include minimumPrice
const formSchema = z.object({
  price: z.coerce.number().min(0, { message: "Price must be 1 or higher" }),
  minimumPrice: z.coerce
    .number()
    .min(0, { message: "Minimum price must be 1 or higher" }),
});

const ProductPriceForm = ({ initialData, productId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  // ✅ Added minimumPrice to defaultValues
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
      minimumPrice: initialData?.minimumPrice || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // ✅ Now sends both price and minimumPrice
      await axios.patch(`/api/products/${productId}`, values);
      toast.success("Product updated successfully!");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Product Price</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit price
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-2 space-y-2">
          <p
            className={cn(
              "text-sm",
              !initialData?.price && "text-slate-500 italic"
            )}
          >
            {initialData?.price
              ? `Price: ${formatPrice(initialData?.price)}`
              : "No price set"}
          </p>
          {/* <p
            className={cn(
              "text-sm",
              !initialData?.minimumPrice && "text-slate-500 italic"
            )}
          >
            {initialData?.minimumPrice
              ? `Minimum Price: ${formatPrice(initialData?.minimumPrice)}`
              : "No minimum price set"}
          </p> */}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* ✅ Price Input */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      min={1}
                      placeholder="Set product price"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Minimum Price Input */}
            <FormField
              control={form.control}
              name="minimumPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      min={1}
                      placeholder="Set product minimum price"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ProductPriceForm;
