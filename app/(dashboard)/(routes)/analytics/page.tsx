import React from "react";
import type { Metadata } from "next";
import { getAnalytics } from "@/actions/get-analytics";
import { redirect } from "next/navigation";
import DataCard from "./_components/DataCard";
import Chart from "./_components/Chart";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Analytics | E-JOUD",
  description: "E-JOUD Analytics.",
};

const AnalyticsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Sales" value={totalSales} />
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
      </div>

      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
