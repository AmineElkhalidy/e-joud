import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientNameForm from "./_components/ClientNameForm";
import ClientActions from "./_components/ClientActions";

const ClientDetailsPage = async ({
  params,
}: {
  params: { clientId: string };
}) => {
  const { clientId } = await params;
  const { userId } = await auth();

  if (!userId) return redirect("/clients");

  const client = await db.client.findUnique({
    where: {
      id: clientId,
    },
  });

  const purchases = await db.purchase.findMany({
    where: {
      clientId,
    },
  });

  if (!client) return redirect("/clients");

  return (
    <div>
      <div className="flex justify-end mt-4">
        <ClientActions clientId={clientId} />
      </div>
      <div className="md:w-1/2">
        <ClientNameForm initialData={client} clientId={clientId} />
      </div>
    </div>
  );
};

export default ClientDetailsPage;
