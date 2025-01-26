import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Dash from "./_components/Dash";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard | E-JOUD",
  description: "Manage products and clients efficiently.",
};

const Dashboard = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  // Fetch the data for analytics
  const totalRevenue = await db.purchase.aggregate({
    where: { userId },
    _sum: { totalPrice: true },
  });

  const totalOrders = await db.purchase.count({
    where: { userId },
  });

  const topSellingProducts = await db.purchasedItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const products = await db.product.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  const categoryDistribution = await db.product.groupBy({
    by: ["categoryId"], // Include `categoryId` here
    _count: { categoryId: true }, // Count how many products belong to each category
    orderBy: { _count: { categoryId: "desc" } }, // Order by the count
  });

  const categories = await db.category.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  const resolvedTopProducts = topSellingProducts.map((item) => ({
    name:
      products.find((product) => product.id === item.productId)?.name ||
      "Unknown",
    sales: item._sum.quantity,
  }));

  const resolvedCategoryDistribution = categoryDistribution.map((item) => ({
    name:
      categories.find((category) => category.id === item.categoryId)?.name ||
      "Uncategorized",
    value: item._count.categoryId,
  }));

  return (
    <Dash
      totalRevenue={totalRevenue._sum.totalPrice || 0}
      totalOrders={totalOrders}
      topProducts={resolvedTopProducts}
      categoryDistribution={resolvedCategoryDistribution}
    />
  );
};

export default Dashboard;
