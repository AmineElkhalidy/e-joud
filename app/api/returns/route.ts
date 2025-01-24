import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productId, quantity, reason } = await request.json();

    if (!productId || !quantity || !reason) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Fetch the product to ensure it exists and has sufficient stock
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    if (product?.quantity! < quantity) {
      return NextResponse.json(
        { error: "Not enough stock to register the return." },
        { status: 400 }
      );
    }

    // Create the return record
    const newReturn = await db.return.create({
      data: {
        productId,
        quantity,
        reason,
        status: "PENDING",
      },
    });

    // Decrement the product's quantity
    await db.product.update({
      where: { id: productId },
      data: {
        quantity: product?.quantity! - quantity,
      },
    });

    return NextResponse.json(newReturn);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create return." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all returns for the user's products
    const returns = await db.return.findMany({
      where: {
        product: {
          userId,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(returns);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch returns." },
      { status: 500 }
    );
  }
}
