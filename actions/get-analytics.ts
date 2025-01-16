import { db } from "@/lib/db";
import { Product, Purchase, Client } from "@prisma/client";

type PurchaseWithClient = Purchase & {
  client: Client;
};

const groupByCourse = (purchases: PurchaseWithClient[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const clientName = purchase.client?.fullName;

    if (!grouped[clientName]) {
      grouped[clientName] = 0;
    }

    grouped[clientName] += purchase.totalPrice;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        client: {
          userId,
        },
      },
      include: {
        purchasedItems: true,
      },
    });

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => curr.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
