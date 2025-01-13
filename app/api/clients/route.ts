import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const clients = await db.client.findMany();
    return NextResponse.json(clients);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    const client = await db.client.create({
      data: { name },
    });

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(error);
  }
}
