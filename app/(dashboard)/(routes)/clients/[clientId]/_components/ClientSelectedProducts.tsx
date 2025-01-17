"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  professionalMinimumPrice: number;
  category: {
    name: string;
  };
}

interface Props {
  clientId: string;
}

const ClientSelectedProduct: React.FC<Props> = ({ clientId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId) || null;
    setSelectedProduct(product);
    setPrice(product?.price ?? 0);
    setQuantity(1);
  };

  const handleSave = async () => {
    if (!selectedProduct) {
      return toast.error("Please select a product");
    }

    if (quantity > selectedProduct.quantity) {
      return toast.error("Quantity exceeds available stock");
    }

    // ✅ Check if the entered price is below the professional minimum price
    if (price < (selectedProduct.professionalMinimumPrice ?? 0)) {
      return toast.error(`Price is lower than it's supposed to be`);
    }

    startTransition(async () => {
      try {
        const response = await axios.post("/api/purchases", {
          productId: selectedProduct.id,
          userId,
          clientType: "PROFESSIONAL",
          clientId,
          quantity,
          price,
        });

        if (response?.status === 200) {
          toast.success("Product purchased successfully!");
          router.refresh();
        } else {
          toast.error("Failed to record purchase");
        }
      } catch (error) {
        toast.error("Failed to record purchase");
      }
    });
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <p className="font-medium">Select the product</p>
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-5 mt-4">
        <Select onValueChange={handleProductSelect}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              products.reduce((groups, product) => {
                const category = product?.category?.name;
                if (!groups.has(category)) groups.set(category, []);
                groups.get(category)!.push(product);
                return groups;
              }, new Map<string, Product[]>())
            ).map(([category, products], index) => (
              <SelectGroup key={index}>
                <SelectLabel>{category}</SelectLabel>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <div className="relative lg:w-fit">
          <span className="text-sm absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            Price
          </span>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full bg-white text-right placeholder:text-left"
          />

          {/* ✅ Hint for Professional Minimum Price */}
          {selectedProduct?.professionalMinimumPrice && (
            <p className="absolute text-xs text-gray-500 mt-1">
              Min Price:{" "}
              <span className="font-semibold text-red-600">
                {selectedProduct.professionalMinimumPrice} MAD
              </span>
            </p>
          )}
        </div>

        <div className="relative lg:w-fit">
          <span className="text-sm absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            Quantity
          </span>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min={1}
            className="w-full bg-white text-right placeholder:text-left"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default ClientSelectedProduct;
