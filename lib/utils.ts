import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function increaseQuantity(id: string) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
  });
}
