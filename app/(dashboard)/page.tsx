import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
