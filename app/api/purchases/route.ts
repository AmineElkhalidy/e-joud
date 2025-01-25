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

    // Fetch all purchases and aggregate by client
    const purchases = await db.purchase.groupBy({
      by: ["clientId"],
      where: { userId },
      _max: { createdAt: true },
      _sum: { totalPrice: true },
    });

    const aggregatedPurchases = await Promise.all(
      purchases.map(async (groupedPurchase) => {
        const latestPurchase = await db.purchase.findFirst({
          where: {
            userId,
            clientId: groupedPurchase.clientId,
            createdAt: groupedPurchase._max.createdAt,
          },
          include: {
            client: true, // Include client relation
          },
        });

        return {
          id: latestPurchase?.id || "",
          client: {
            id: latestPurchase?.client?.id || "",
            name: latestPurchase?.client?.fullName || "Unknown",
            type: latestPurchase?.client?.clientType || "Unknown",
          },
          totalItems: groupedPurchase._sum.totalItems || 0,
          totalPrice: groupedPurchase._sum.totalPrice || 0,
          paymentStatus: latestPurchase?.paymentStatus || "Unknown",
          createdAt: latestPurchase?.createdAt || new Date(),
        };
      })
    );

    return NextResponse.json(aggregatedPurchases);
  } catch (error) {
    console.error("Error fetching aggregated purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
