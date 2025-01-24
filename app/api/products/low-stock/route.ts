import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch low stock products
    const lowStockProducts = await db.product.findMany({
      where: {
        userId,
        quantity: {
          lte: db.product.fields.minimumQuantity, // Compare quantity to minimumQuantity field
        },
      },
      select: {
        id: true,
        name: true,
        quantity: true,
        minimumQuantity: true,
      },
    });

    return NextResponse.json(lowStockProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch low stock products." },
      { status: 500 }
    );
  }
}
