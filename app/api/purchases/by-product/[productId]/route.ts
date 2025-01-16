import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = await params;

    // ✅ Extract clientId from query parameters
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    console.log("🔍 Product ID:", productId);
    console.log("🔍 Client ID:", clientId);

    if (!clientId) {
      return NextResponse.json(
        { message: "Client ID is required." },
        { status: 400 }
      );
    }

    // ✅ Find the purchase related to both product and client
    const purchasedItem = await db.purchasedItem.findFirst({
      where: {
        productId,
        purchase: {
          clientId, // ✅ Filter by clientId
        },
      },
      include: {
        purchase: true,
      },
    });

    if (!purchasedItem) {
      console.error("❌ No purchase found for this product and client.");
      return NextResponse.json(
        { message: "No purchase found for this product and client." },
        { status: 404 }
      );
    }

    console.log("✅ Purchase ID Found:", purchasedItem.purchaseId);

    return NextResponse.json(
      { purchaseId: purchasedItem.purchaseId },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching purchase:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
