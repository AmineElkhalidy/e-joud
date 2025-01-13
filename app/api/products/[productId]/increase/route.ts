import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: { productId: string };
  }
) {
  try {
    const { userId } = await auth();
    const productId = params.productId;
    const { quantity } = await request.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (quantity < 1) {
      const product = await db.product.delete({
        where: { id: productId },
      });
      return NextResponse.json("Product removed as it is out of stock");
    }

    const product = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        quantity,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[INCREMENT QUANTITY]", error);
    return NextResponse.json(error);
  }
}
