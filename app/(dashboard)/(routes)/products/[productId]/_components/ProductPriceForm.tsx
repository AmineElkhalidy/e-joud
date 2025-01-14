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

const formSchema = z.object({
  price: z.coerce.number().min(0, { message: "Price must be 1 or higher" }),
});

const ProductPriceForm = ({ initialData, productId }: Props) => {
  const [isEditting, setIsEditting] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditting((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
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
          {isEditting ? (
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

      {!isEditting && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.price && "text-slate-500 italic"
          )}
        >
          {initialData?.price ? formatPrice(initialData?.price) : "No price"}
        </p>
      )}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      step={0.01}
                      min={0}
                      placeholder="Set a price for your product"
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
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ProductPriceForm;
