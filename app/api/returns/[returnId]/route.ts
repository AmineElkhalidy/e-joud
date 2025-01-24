import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { returnId: string } }
) {
  try {
    const { userId } = await auth();
    const { returnId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const returnRecord = await db.return.findUnique({
      where: { id: returnId },
    });

    if (!returnRecord) {
      return NextResponse.json({ error: "Return not found." }, { status: 404 });
    }

    if (returnRecord.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending returns can be processed." },
        { status: 400 }
      );
    }

    const updatedReturn = await db.return.update({
      where: { id: returnId },
      data: { status: "PROCESSED" },
    });

    return NextResponse.json(updatedReturn);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update return status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { returnId: string } }
) {
  try {
    const { userId } = await auth();
    const { returnId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the return record
    const returnRecord = await db.return.findUnique({
      where: { id: returnId },
    });

    if (!returnRecord) {
      return NextResponse.json({ error: "Return not found." }, { status: 404 });
    }

    // Increment the product's quantity to revert the returned items
    await db.product.update({
      where: { id: returnRecord.productId },
      data: {
        quantity: {
          increment: returnRecord.quantity,
        },
      },
    });

    // Delete the return record
    await db.return.delete({
      where: { id: returnId },
    });

    return NextResponse.json({ message: "Return deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete return." },
      { status: 500 }
    );
  }
}
