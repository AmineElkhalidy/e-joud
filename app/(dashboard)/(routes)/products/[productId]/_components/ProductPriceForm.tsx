// "use client";

// import React, { useState } from "react";
// import { z } from "zod";
// import axios from "axios";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Pencil } from "lucide-react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Product } from "@prisma/client";
// import { formatPrice } from "@/lib/format";
// import { Label } from "@/components/ui/label";

// interface Props {
//   initialData: Product;
//   productId: string;
// }

// // ✅ Updated schema to include professionalMinimumPrice
// const formSchema = z.object({
//   price: z.coerce.number().min(0, { message: "Price must be 1 or higher" }),
//   minimumPrice: z.coerce
//     .number()
//     .min(0, { message: "Minimum price must be 1 or higher" }),
//   professionalMinimumPrice: z.coerce
//     .number()
//     .min(0, { message: "Professional minimum price must be 1 or higher" }),
// });

// const ProductPriceForm = ({ initialData, productId }: Props) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const router = useRouter();
//   const toggleEdit = () => setIsEditing((current) => !current);

//   // ✅ Added professionalMinimumPrice to defaultValues
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       price: initialData?.price || undefined,
//       minimumPrice: initialData?.minimumPrice || undefined,
//       professionalMinimumPrice:
//         initialData?.professionalMinimumPrice || undefined,
//     },
//   });

//   const { isSubmitting, isValid } = form.formState;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       // ✅ Sending all price values to the API
//       await axios.patch(`/api/products/${productId}`, values);
//       toast.success("Product updated successfully!");
//       toggleEdit();
//       router.refresh();
//     } catch {
//       toast.error("Something went wrong!");
//     }
//   };

//   return (
//     <div className="mt-6 border bg-slate-100 rounded-md p-4">
//       <div className="font-medium flex items-center justify-between">
//         <span>Product Price</span>
//         <Button variant="ghost" onClick={toggleEdit}>
//           {isEditing ? (
//             "Cancel"
//           ) : (
//             <>
//               <Pencil className="h-4 w-4 mr-2" /> Edit Price
//             </>
//           )}
//         </Button>
//       </div>

//       {!isEditing && (
//         <div className="mt-2 space-y-2">
//           <p
//             className={cn(
//               "text-sm",
//               !initialData?.price && "text-slate-500 italic"
//             )}
//           >
//             {initialData?.price
//               ? `${formatPrice(initialData?.price)}`
//               : "No price set"}
//           </p>
//         </div>
//       )}

//       {isEditing && (
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-4 mt-4"
//           >
//             {/* ✅ Standard Price Input */}
//             <FormField
//               control={form.control}
//               name="price"
//               render={({ field }) => (
//                 <FormItem>
//                   <Label className="text-muted-foreground">Price</Label>
//                   <FormControl>
//                     <Input
//                       disabled={isSubmitting}
//                       type="number"
//                       step={0.01}
//                       min={1}
//                       placeholder="Set product price"
//                       className="bg-white"
//                       {...(field ?? "")}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* ✅ Minimum Price for Regular Clients */}
//             <FormField
//               control={form.control}
//               name="minimumPrice"
//               render={({ field }) => (
//                 <FormItem>
//                   <Label className="text-muted-foreground">
//                     Minimum selling price for clients
//                   </Label>
//                   <FormControl>
//                     <Input
//                       disabled={isSubmitting}
//                       type="number"
//                       step={0.01}
//                       min={1}
//                       placeholder="Set minimum price for regular clients"
//                       className="bg-white"
//                       {...(field ?? "")}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* ✅ Minimum Price for Professional Clients */}
//             <FormField
//               control={form.control}
//               name="professionalMinimumPrice"
//               render={({ field }) => (
//                 <FormItem>
//                   <Label className="text-muted-foreground">
//                     Minimum selling price for '7rayfi'
//                   </Label>
//                   <FormControl>
//                     <Input
//                       disabled={isSubmitting}
//                       type="number"
//                       step={0.01}
//                       min={1}
//                       placeholder="Set minimum price for professional clients"
//                       className="bg-white"
//                       {...(field ?? "")}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex items-center gap-x-2">
//               <Button disabled={!isValid || isSubmitting} type="submit">
//                 {isSubmitting ? "Saving..." : "Save"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       )}
//     </div>
//   );
// };

// export default ProductPriceForm;

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
import { Label } from "@/components/ui/label";

interface Props {
  initialData: Product;
  productId: string;
}

const formSchema = z.object({
  price: z.coerce.number().min(0, { message: "Price must be 1 or higher" }),
  minimumPrice: z.coerce
    .number()
    .min(0, { message: "Minimum price must be 1 or higher" }),
  professionalMinimumPrice: z.coerce
    .number()
    .min(0, { message: "Professional minimum price must be 1 or higher" }),
  purchasedPrice: z.coerce.number().min(0, {
    message: "Purchased price must be 1 or higher",
  }), // New field for purchased price
});

const ProductPriceForm = ({ initialData, productId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
      minimumPrice: initialData?.minimumPrice || undefined,
      professionalMinimumPrice:
        initialData?.professionalMinimumPrice || undefined,
      purchasedPrice: initialData?.purchasedPrice || undefined, // New default value
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

  // Calculate profit margin dynamically
  const calculateProfitMargin = () => {
    const purchasedPrice = form.getValues("purchasedPrice");
    const sellingPrice = form.getValues("price");
    if (purchasedPrice > 0 && sellingPrice > 0) {
      const profit = sellingPrice - purchasedPrice;
      return `${((profit / purchasedPrice) * 100).toFixed(2)}%`;
    }
    return "N/A";
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Product Price</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit Price
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
              ? `${formatPrice(initialData?.price)}`
              : "No price set"}
          </p>
          <p className="text-sm">
            <strong>Profit Margin:</strong> {calculateProfitMargin()}
          </p>
        </div>
      )}

      {isEditing && (
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
                  <Label className="text-muted-foreground">Price</Label>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      step={0.01}
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

            <FormField
              control={form.control}
              name="minimumPrice"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-muted-foreground">
                    Minimum selling price for clients
                  </Label>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      step={0.01}
                      min={1}
                      placeholder="Set minimum price for regular clients"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professionalMinimumPrice"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-muted-foreground">
                    Minimum selling price for '7rayfi'
                  </Label>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      step={0.01}
                      min={1}
                      placeholder="Set minimum price for professional clients"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Purchased Price Input */}
            <FormField
              control={form.control}
              name="purchasedPrice"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-muted-foreground">
                    Purchased Price
                  </Label>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      step={0.01}
                      min={1}
                      placeholder="Set purchased price"
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
