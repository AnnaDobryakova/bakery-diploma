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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json(product);
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    res.status(500).json({ message: "Не удалось получить товар" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      calories,
      proteins,
      fats,
      carbohydrates,
      category,
      imageUrl,
    } = req.body;

    if (!name || price === undefined || quantity === undefined || !category) {
      return res.status(400).json({
        message: "Не заполнены обязательные поля",
      });
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price,
        quantity: Number(quantity),
        calories: calories ?? null,
        proteins: proteins ?? null,
        fats: fats ?? null,
        carbohydrates: carbohydrates ?? null,
        category,
        imageUrl: imageUrl || null,
        isAvailable: Number(quantity) > 0,
      },
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    res.status(500).json({ message: "Не удалось создать товар" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      quantity,
      calories,
      proteins,
      fats,
      carbohydrates,
      category,
      imageUrl,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: name?.trim(),
        description: description?.trim() || null,
        price,
        quantity: Number(quantity),
        calories: calories ?? null,
        proteins: proteins ?? null,
        fats: fats ?? null,
        carbohydrates: carbohydrates ?? null,
        category,
        imageUrl: imageUrl || null,
        isAvailable: Number(quantity) > 0,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    res.status(500).json({ message: "Не удалось обновить товар" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = Number(id);

    const usedInOrders = await prisma.orderItem.findFirst({
      where: { productId },
    });

    if (usedInOrders) {
      return res.status(400).json({
        message:
          "Нельзя удалить товар, так как он уже используется в заказах",
      });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Товар успешно удалён" });
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    res.status(500).json({ message: "Не удалось удалить товар" });
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

export const getProductCategories = async (req, res) => {
  try {
    const groups = await prisma.product.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    const categoryLabels = {
      bread: "Хлеб",
      sweet: "Сладкая выпечка",
      salty: "Солёная выпечка",
      drinks: "Напитки",
    };

    const categories = groups
      .filter((item) => item.category)
      .map((item) => ({
        value: item.category,
        label: categoryLabels[item.category] || item.category,
        productsCount: item._count.category,
      }));

    res.json(categories);
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    res.status(500).json({ message: "Не удалось получить категории" });
  }
};