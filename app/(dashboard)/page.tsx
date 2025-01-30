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
  if (!userId) {
    return redirect("/sign-in");
  }

  // Parse the query parameters for date filtering
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : undefined;
  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : undefined;
  const dateFilter =
    startDate && endDate ? { createdAt: { gte: startDate, lte: endDate } } : {};

  // 1) Total Revenue
  const totalRevenue = await db.purchase.aggregate({
    where: { userId, ...dateFilter },
    _sum: { totalPrice: true },
  });

  // 2) Total Orders
  const totalOrders = await db.purchase.count({
    where: { userId, ...dateFilter },
  });

  // 3) Calculate total spent (purchasedPrice * quantity)
  const purchasedItems = await db.purchasedItem.findMany({
    where: { ...dateFilter },
    include: {
      product: { select: { purchasedPrice: true } },
    },
  });
  const totalSpent = purchasedItems.reduce((sum, item) => {
    const purchasedPrice = item.product?.purchasedPrice || 0;
    return sum + purchasedPrice * item.quantity;
  }, 0);

  // 4) Profit
  const totalProfit = (totalRevenue._sum.totalPrice || 0) - totalSpent;

  // 5) Top-Selling Products
  const topSellingProducts = await db.purchasedItem
    .groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: { ...dateFilter },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    })
    .catch(() => []);

  // Resolve product names
  const products = await db.product.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  const resolvedTopProducts = topSellingProducts.map((item) => ({
    name: products.find((p) => p.id === item.productId)?.name || "Unknown",
    sales: item._sum.quantity || 0,
  }));

  return (
    <Dash
      totalRevenue={totalRevenue._sum.totalPrice || 0}
      totalSpent={totalSpent}
      totalProfit={totalProfit}
      totalOrders={totalOrders}
      topProducts={resolvedTopProducts}
      // Additional props if needed
    />
  );
};

export default Dashboard;
