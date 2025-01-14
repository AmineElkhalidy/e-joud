const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Phones" },
        { name: "Pcs" },
        { name: "Tablets" },
        { name: "Afficheurs (LCD, etc...)" },
        { name: "Accessories" },
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
