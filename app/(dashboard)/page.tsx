import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Dash from "./_components/Dash";

export const metadata: Metadata = {
  title: "Dashboard | E-JOUD",
  description: "Manage products and clients efficiently.",
};

const Dashboard = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  return <Dash />;
};

export default Dashboard;
