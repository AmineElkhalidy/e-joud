import { db } from "@/lib/db";
import { Category, Product } from "@prisma/client";

type GetProductsProps = {
  name?: string;
  price?: number;
  quantity?: string;
  categoryId?: string;
};

export const getProducts = async ({
  name,
  price,
  quantity,
  categoryId,
}: GetProductsProps) => {};
