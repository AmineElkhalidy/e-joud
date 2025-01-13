import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { clientId, items } = await request.json();
    // items: { productId: string; quantity: number }[]

    // calculate totalPrice by summing all product (price * quantity)
    const productIds = items.map((item: any) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    let totalPrice = 0;
    const orderItemsData = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      const subTotal = product.price! * item.quantity;
      totalPrice += subTotal;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // create the Order and related OrderItems
    const order = await db.order.create({
      data: {
        clientId,
        totalPrice,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Decrement stock (quantity) from Product table or handle that logic here
    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
