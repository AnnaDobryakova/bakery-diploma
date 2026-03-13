import prisma from "../prisma.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    res.status(500).json({ message: "Не удалось получить товары" });
  }
};

export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const normalizedQuantity = Number(quantity);

    if (Number.isNaN(normalizedQuantity) || normalizedQuantity < 0) {
      return res.status(400).json({
        message: "Количество должно быть числом не меньше 0",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        quantity: normalizedQuantity,
        isAvailable: normalizedQuantity > 0,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Ошибка при обновлении остатка:", error);
    res.status(500).json({ message: "Не удалось обновить остаток товара" });
  }
};