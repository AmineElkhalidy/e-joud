import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Dash from "./_components/Dash";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard | E-JOUD",
  description: "Manage products and clients efficiently.",
};

const Dashboard = async ({
  searchParams,
}: {
  searchParams: { startDate?: string; endDate?: string };
}) => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  // Parse the query parameters
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : undefined;
  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : undefined;

  // Common date filter
  const dateFilter =
    startDate && endDate ? { createdAt: { gte: startDate, lte: endDate } } : {};

  // Fetch the data for analytics
  const totalRevenue = await db.purchase.aggregate({
    where: { userId, ...dateFilter },
    _sum: { totalPrice: true },
  });

  const totalOrders = await db.purchase.count({
    where: { userId, ...dateFilter },
  });

  const topSellingProducts = await db.purchasedItem
    .groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: { ...dateFilter },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    })
    .catch(() => []);

  const products = await db.product.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  const categoryDistribution = await db.product
    .groupBy({
      by: ["categoryId"],
      _count: { categoryId: true },
      where: { ...dateFilter },
      orderBy: { _count: { categoryId: "desc" } },
    })
    .catch(() => []);

  const categories = await db.category.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  // Resolve data safely
  const resolvedTopProducts = topSellingProducts.map((item) => ({
    name:
      products.find((product) => product.id === item.productId)?.name ||
      "Unknown",
    sales: item._sum.quantity || 0,
  }));

  const resolvedCategoryDistribution = categoryDistribution.map((item) => ({
    name:
      categories.find((category) => category.id === item.categoryId)?.name ||
      "Uncategorized",
    value: item._count.categoryId || 0,
  }));

  return (
    <Dash
      totalRevenue={totalRevenue._sum.totalPrice || 0}
      totalOrders={totalOrders || 0}
      topProducts={resolvedTopProducts.length ? resolvedTopProducts : []}
      categoryDistribution={
        resolvedCategoryDistribution.length ? resolvedCategoryDistribution : []
      }
    />
  );
};

export default Dashboard;
