import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { purchaseId: string } }
) {
  const { userId } = await auth();
  const { purchaseId } = await params;

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await db.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      client: true,
      purchasedItems: {
        include: { product: true },
      },
    },
  });

  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json(order);
}
