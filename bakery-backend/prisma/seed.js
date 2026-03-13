import { PrismaClient } from "@prisma/client";
import { mockDataProducts } from "../../src/data/mockData.js";

const prisma = new PrismaClient();

const products = mockDataProducts.map((item) => ({
  name: item.name,
  description: item.description,
  price: item.price,
  quantity: item.remainder,
  calories: item.nutrition?.calories ?? null,
  proteins: item.nutrition?.proteins ?? null,
  fats: item.nutrition?.fats ?? null,
  carbohydrates: item.nutrition?.carbs ?? null,
  category: item.category,
  imageUrl: item.imageURL,
  isAvailable: item.remainder > 0,
}));

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: products,
  });

  console.log(`Добавлено товаров: ${products.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Ошибка seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });