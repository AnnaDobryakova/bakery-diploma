import { PrismaClient } from "@prisma/client";
import { mockDataProducts } from "../../src/data/mockData.js";

const prisma = new PrismaClient();

const categoryDictionary = {
  bread: "Хлеб",
  sweet: "Сладкая выпечка",
  salty: "Солёная выпечка",
  drinks: "Напитки",
};

async function main() {
  // 1. Создаём или обновляем категории
  const uniqueCategoryCodes = [
    ...new Set(mockDataProducts.map((item) => item.category).filter(Boolean)),
  ];

  for (const code of uniqueCategoryCodes) {
    await prisma.category.upsert({
      where: { code },
      update: {
        name: categoryDictionary[code] || code,
        description: null,
      },
      create: {
        code,
        name: categoryDictionary[code] || code,
        description: null,
      },
    });
  }

  // 2. Получаем актуальные категории
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((cat) => [cat.code, cat.id]));

  // 3. Создаём или обновляем товары
  for (const item of mockDataProducts) {
    const categoryId = categoryMap.get(item.category) ?? null;

    const existingProduct = await prisma.product.findFirst({
      where: { name: item.name },
    });

    const productData = {
      name: item.name,
      description: item.description || null,
      price: item.price,
      quantity: item.remainder ?? 0,
      calories: item.nutrition?.calories ?? null,
      proteins: item.nutrition?.proteins ?? null,
      fats: item.nutrition?.fats ?? null,
      carbohydrates: item.nutrition?.carbs ?? null,
      categoryId,
      imageUrl: item.imageURL ?? null,
      isAvailable: (item.remainder ?? 0) > 0,
    };

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: productData,
      });
    } else {
      await prisma.product.create({
        data: productData,
      });
    }
  }

  console.log("Seed выполнен без удаления заказов");
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