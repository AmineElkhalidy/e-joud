import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { userId } = await auth();
    const { clientId } = await params;
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
    return NextResponse.json(error);
  }
}

// export async function DELETE(
//   request: Request,
//   { params }: { params: { clientId: string } }
// ) {
//   try {
//     const { userId } = await auth();
//     const { clientId } = await params;
//     if (!userId) return new NextResponse("Unauthorized", { status: 401 });

//     if (!clientId) {
//       return NextResponse.json(
//         { error: "Client ID is required!" },
//         { status: 400 }
//       );
//     }

//     await db.client.delete({
//       where: { id: clientId },
//     });

//     return NextResponse.json(
//       { message: "Client deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete client" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { userId } = await auth();
    const { clientId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required!" },
        { status: 400 }
      );
    }

    // Check if the client has unpaid purchases
    const unpaidPurchases = await db.purchase.findMany({
      where: {
        clientId,
        paymentStatus: "UNPAID",
      },
    });

    if (unpaidPurchases.length > 0) {
      return NextResponse.json(
        { error: "Can't delete client with unpaid purchases." },
        { status: 400 }
      );
    }

    // Proceed with deleting the client
    await db.client.delete({
      where: { id: clientId },
    });

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
