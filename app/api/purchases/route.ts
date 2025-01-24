import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

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

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await db.purchase.findMany({
      where: { userId },
      include: {
        client: true, // Ensure the `client` relation exists in your schema
        purchasedItems: true, // Ensure `purchasedItems` relation exists in your schema
      },
      orderBy: { createdAt: "desc" },
    });

    // Map orders for better response structure
    const mappedOrders = orders.map((order) => ({
      id: order.id,
      client: {
        name: order?.client?.fullName || "Unknown",
        type: order?.client?.clientType || "Unknown",
      },
      totalItems: order?.purchasedItems?.length,
      totalPrice: order.totalPrice,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    }));

    return NextResponse.json(mappedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error); // Log the error
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
