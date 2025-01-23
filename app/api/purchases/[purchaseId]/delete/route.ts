import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { purchaseId: string } }
) {
  const { purchaseId } = await params;

  if (!purchaseId) {
    return NextResponse.json(
      { error: "Purchase ID is required" },
      { status: 400 }
    );
  }

  try {
    // Delete the purchase
    await db.purchase.delete({
      where: { id: purchaseId },
    });

    return NextResponse.json(
      { message: "Purchase deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return NextResponse.json(
      { error: "Failed to delete purchase" },
      { status: 500 }
    );
  }
}
