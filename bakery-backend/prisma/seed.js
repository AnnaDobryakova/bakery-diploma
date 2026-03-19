import { PrismaClient } from "@prisma/client";
import { mockDataProducts } from "../../src/data/mockData.js";

const prisma = new PrismaClient();

function makeCode(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\wа-яё]/gi, "");
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const uniqueCategoryNames = [
    ...new Set(mockDataProducts.map((item) => item.category).filter(Boolean)),
  ];

  const categoriesData = uniqueCategoryNames.map((name) => ({
    name,
    code: makeCode(name),
    description: null,
  }));

  await prisma.category.createMany({
    data: categoriesData,
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();

  const categoryMap = new Map(categories.map((cat) => [cat.name, cat.id]));

  const products = mockDataProducts.map((item) => ({
    name: item.name,
    description: item.description,
    price: item.price,
    quantity: item.remainder ?? 0,
    calories: item.nutrition?.calories ?? null,
    proteins: item.nutrition?.proteins ?? null,
    fats: item.nutrition?.fats ?? null,
    carbohydrates: item.nutrition?.carbs ?? null,
    categoryId: categoryMap.get(item.category) ?? null,
    imageUrl: item.imageURL ?? null,
    isAvailable: (item.remainder ?? 0) > 0,
  }));

  await prisma.product.createMany({
    data: products,
  });

  console.log(`Добавлено категорий: ${categoriesData.length}`);
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