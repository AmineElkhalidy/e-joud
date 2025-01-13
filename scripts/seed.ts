const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Phones" },
        { name: "Airpods" },
        { name: "Cables" },
        { name: "Afficheurs" },
        { name: "Phone Accessories" },
        { name: "Mouses" },
        { name: "Pcs" },
        { name: "PC Accessories" },
        { name: "Batteries" },
        { name: "Gaming" },
        { name: "Watches" },
      ],
    });
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
