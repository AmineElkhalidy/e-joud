import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { productId, userId, clientType, clientId } = await req.json();

    // 1. Find the product
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.quantity === 0) {
      return NextResponse.json(
        { message: "Product not available" },
        { status: 404 }
      );
    }

    let clientIdToUse: string | undefined = undefined;

    // 2. Handle PROFESSIONAL client lookup
    if (clientType === "PROFESSIONAL" && clientId) {
      const client = await db.client.findUnique({
        where: { id: clientId },
      });

      if (!client) {
        return NextResponse.json(
          { message: "Professional client not found" },
          { status: 404 }
        );
      }

      clientIdToUse = client.id;
    }

    // 3. Check if a purchase for the same product and user/client already exists
    const existingPurchase = await db.purchase.findFirst({
      where: {
        userId,
        clientId: clientIdToUse,
        purchasedItems: {
          some: {
            productId: productId,
          },
        },
      },
    });

    if (existingPurchase) {
      // 4. If purchase exists, update the PurchasedItem quantity and totalPrice
      await db.purchasedItem.updateMany({
        where: {
          purchaseId: existingPurchase.id,
          productId: productId,
        },
        data: {
          quantity: { increment: 1 },
          price: product.price ?? 0,
        },
      });

      await db.purchase.update({
        where: { id: existingPurchase.id },
        data: {
          totalPrice: {
            increment: product.price ?? 0,
          },
          paidAmount: {
            increment: product.price ?? 0,
          },
        },
      });
    } else {
      // 5. If no purchase exists, create a new Purchase and PurchasedItem
      const newPurchase = await db.purchase.create({
        data: {
          userId,
          clientId: clientIdToUse,
          totalPrice: product.price ?? 0,
          paidAmount: product.price ?? 0,
          paymentStatus: PaymentStatus.PAID,
          purchasedItems: {
            create: {
              productId: product.id,
              quantity: 1,
              price: product.price ?? 0,
            },
          },
        },
      });
    }

    // 6. Decrease product quantity by 1
    await db.product.update({
      where: { id: productId },
      data: {
        quantity: { decrement: 1 },
      },
    });

    return NextResponse.json(
      { message: "Purchase recorded successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing purchase:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
