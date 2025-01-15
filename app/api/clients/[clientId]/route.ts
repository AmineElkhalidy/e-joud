import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { userId } = await auth();
    const { clientId } = params;
    const values = await request.json();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const client = await db.client.update({
      where: {
        id: clientId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(client);
  } catch (error) {
    console.error("[PATCHING CLIENT]", error);
    return NextResponse.json(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { userId } = await auth();
    const { clientId } = params;
    if (!userId) return new NextResponse("Unauthorized!", { status: 401 });

    const product = await db.client.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!product) {
      return new NextResponse("Not found!", { status: 404 });
    }

    const deletedClient = await db.client.delete({
      where: {
        id: clientId,
      },
    });

    return NextResponse.json(deletedClient);
  } catch (error) {
    console.error("[DELETING CLIENT]", error);
    return NextResponse.json(error);
  }
}
