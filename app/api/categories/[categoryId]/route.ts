import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = await auth();
    const { categoryId } = await params;
    const values = await request.json();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const category = await db.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[PATCHING CATEGORY]", error);
    return NextResponse.json(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = await auth();
    const { categoryId } = await params;
    if (!userId) return new NextResponse("Unauthorized!", { status: 401 });

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return new NextResponse("Not found!", { status: 404 });
    }

    const deletedProduct = await db.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    return NextResponse.json(error);
  }
}
