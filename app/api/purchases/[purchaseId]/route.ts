import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { purchaseId: string } }
) {
  try {
    const { purchaseId } = params;
    const { status } = await req.json();

    // ✅ Validate the status
    if (!["PAID", "UNPAID"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid payment status" },
        { status: 400 }
      );
    }

    // ✅ Check if purchase exists
    const purchase = await db.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      return NextResponse.json(
        { message: "Purchase not found" },
        { status: 404 }
      );
    }

    // ✅ Update the payment status
    await db.purchase.update({
      where: { id: purchaseId },
      data: { paymentStatus: status },
    });

    return NextResponse.json(
      { message: `Status updated to ${status}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
