import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { clientId, productId, price, quantity } = await request.json();

  try {
    // Validate client and product existence
    const client = await db.client.findUnique({ where: { id: clientId } });
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product?.quantity! < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product.name}` },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = price * quantity;

    // Create a purchase record
    const purchase = await db.purchase.create({
      data: {
        clientId,
        userId: client.userId,
        totalPrice,
        purchasedItems: {
          create: {
            productId,
            price,
            quantity,
          },
        },
      },
      include: {
        purchasedItems: true,
      },
    });

    // Update product quantity
    await db.product.update({
      where: { id: productId },
      data: {
        quantity: product.quantity! - quantity,
      },
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
