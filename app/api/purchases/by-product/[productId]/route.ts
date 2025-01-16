import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = await params;

    // ✅ Find the purchase related to this product
    const purchasedItem = await db.purchasedItem.findFirst({
      where: { productId },
      include: {
        purchase: true,
      },
    });

    if (!purchasedItem) {
      return NextResponse.json(
        { message: "No purchase found for this product" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { purchaseId: purchasedItem.purchaseId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching purchase:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
