import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  const { purchaseId } = params;
  const { paymentStatus } = await req.json();

  if (!purchaseId || !paymentStatus) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    // Update the purchase's payment status
    await db.purchase.update({
      where: { id: purchaseId },
      data: { paymentStatus },
    });

    return NextResponse.json({
      message: "Payment status updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update payment status." },
      { status: 500 }
    );
  }
}
