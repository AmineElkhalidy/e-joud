import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { clientId, productId } = await req.json();

    if (!clientId || !productId) {
      return NextResponse.json(
        { message: "Client ID and Product ID are required." },
        { status: 400 }
      );
    }

    const purchase = await db.purchase.findFirst({
      where: {
        clientId,
        purchasedItems: {
          some: {
            productId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { message: "Purchase not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ purchaseId: purchase.id }, { status: 200 });
  } catch (error) {
    console.error("Error fetching purchase ID:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
