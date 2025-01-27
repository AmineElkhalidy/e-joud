import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { firstName, lastName, email, role } = await request.json();

  if (!firstName || !lastName || !email || !role) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  await db.user.create({
    data: { firstName, lastName, email, role },
  });

  return NextResponse.json({ message: "User created successfully!" });
}
