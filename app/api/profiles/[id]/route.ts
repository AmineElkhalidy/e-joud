import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  await db.user.delete({
    where: { id },
  });

  return NextResponse.json({ message: "User deleted successfully!" });
}
