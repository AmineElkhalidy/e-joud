import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { userId } = await auth();
    const { clientId } = params;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await db.client.findUnique({
      where: { id: clientId },
    });

    if (!client)
      return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const clientOrders = await db.purchase.findMany({
      where: {
        userId,
        clientId,
      },
      include: {
        purchasedItems: {
          include: { product: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map orders for better structure
    const mappedOrders = clientOrders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      totalItems: order.purchasedItems.length,
      totalPrice: order.totalPrice,
      paymentStatus: order.paymentStatus,
      purchasedItems: order.purchasedItems,
    }));

    return NextResponse.json({ client, orders: mappedOrders });
  } catch (error) {
    console.error("Error fetching client orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch client orders." },
      { status: 500 }
    );
  }
}
