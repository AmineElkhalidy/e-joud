import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | E-JOUD",
  description: "Manage products and clients efficiently.",
};

const Dashboard = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");
  return (
    <div>
      <p>No data!</p>
    </div>
  );
};

export default Dashboard;
