import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return new NextResponse("Invalid product name!", { status: 400 });
    }

    // Check if the product already exists for the user
    const existingProduct = await db.product.findFirst({
      where: { name, userId },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product already exists!" },
        { status: 400 }
      );
    }

    // Create the product
    const product = await db.product.create({
      data: { userId, name },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product!" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const products = await db.product.findMany({
      where: { userId },
      include: { category: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products!" },
      { status: 500 }
    );
  }
}
