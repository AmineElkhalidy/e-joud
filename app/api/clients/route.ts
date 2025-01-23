import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const body = await request.json();
    const { fullName } = body;

    if (!fullName) {
      return NextResponse.json(
        { error: "Full name is required!" },
        { status: 400 }
      );
    }

    // Create a new client
    const newClient = await db.client.create({
      data: {
        userId,
        fullName,
      },
    });

    return NextResponse.json(newClient);
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const clients = await db.client.findMany({
      orderBy: {
        fullName: "asc",
      },
      include: { purchase: true },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
