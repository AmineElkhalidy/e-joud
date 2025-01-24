import { db } from "@/lib/db";
import { NextResponse } from "next/server";
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
      return new NextResponse("Invalid category name!", { status: 400 });
    }

    // Check if the category already exists for the user
    const existingCategory = await db.category.findFirst({
      where: { name, userId },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists!" },
        { status: 400 }
      );
    }

    // Create the new category
    const category = await db.category.create({
      data: { userId, name },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category!" },
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

    const categories = await db.category.findMany({
      where: { userId },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories!" },
      { status: 500 }
    );
  }
}
