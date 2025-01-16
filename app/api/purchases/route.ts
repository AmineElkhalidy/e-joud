import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";

// ✅ Handle only POST requests
export async function POST(req: Request) {
  try {
    const { productId, userId, clientType, clientId, quantity, price } =
      await req.json();

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

    if (quantity > product?.quantity) {
      return NextResponse.json(
        { message: "Insufficient stock available" },
        { status: 400 }
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
      // 4. Update the PurchasedItem quantity and totalPrice
      await db.purchasedItem.updateMany({
        where: {
          purchaseId: existingPurchase.id,
          productId: productId,
        },
        data: {
          quantity: { increment: quantity },
          price: price ?? product.price ?? 0,
        },
      });

      await db.purchase.update({
        where: { id: existingPurchase.id },
        data: {
          totalPrice: {
            increment: (price ?? product.price ?? 0) * quantity,
          },
          paidAmount: {
            increment: (price ?? product.price ?? 0) * quantity,
          },
        },
      });
    } else {
      // 5. Create a new Purchase and PurchasedItem
      await db.purchase.create({
        data: {
          userId,
          clientId: clientIdToUse,
          totalPrice: (price ?? product.price ?? 0) * quantity,
          paidAmount: (price ?? product.price ?? 0) * quantity,
          paymentStatus: PaymentStatus.UNPAID,
          purchasedItems: {
            create: {
              productId: product.id,
              quantity: quantity,
              price: price ?? product.price ?? 0,
            },
          },
        },
      });
    }

    // 6. Decrease product quantity
    await db.product.update({
      where: { id: productId },
      data: {
        quantity: { decrement: quantity },
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

// ✅ Handle unsupported methods
export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
