import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const body = await request.json();
    const { fullName } = body;

    const client = await db.client.create({
      data: { userId, fullName },
    });

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const clients = await db.client.findMany({ include: { orders: true } });
    return NextResponse.json(clients);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
