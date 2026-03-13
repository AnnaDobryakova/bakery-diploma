import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Круассан",
    description: "Слоёная выпечка с маслом",
    price: 150,
    quantity: 20,
    calories: 320,
    proteins: 6.5,
    fats: 14.2,
    carbohydrates: 50.0,
    category: "Сладкая выпечка",
    imageUrl: "/img/croissant.jpg",
    isAvailable: true,
  },
  {
    name: "Маффин черничный",
    description: "Маффин с черникой",
    price: 210,
    quantity: 15,
    calories: 280,
    proteins: 5.1,
    fats: 10.3,
    carbohydrates: 42.8,
    category: "Десерты",
    imageUrl: "/img/blueberry-muffin.jpg",
    isAvailable: true,
  },
];

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: products,
  });

  console.log("Товары успешно добавлены");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });