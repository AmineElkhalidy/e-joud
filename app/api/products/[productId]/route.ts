import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { userId } = await auth();
    const { productId } = await params;
    const values = await request.json();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const product = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PATCHING PRODUCT]", error);
    return NextResponse.json(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { userId } = await auth();
    const { productId } = params;
    if (!userId) return new NextResponse("Unauthorized!", { status: 401 });

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return new NextResponse("Not found!", { status: 404 });
    }

    const deletedProduct = await db.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error("[DELETING PRODUCT]", error);
    return NextResponse.json(error);
  }
}
