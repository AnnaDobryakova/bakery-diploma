import prisma from "../prisma.js";

const normalizeProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  quantity: product.quantity,
  calories: product.calories,
  proteins: product.proteins,
  fats: product.fats,
  carbohydrates: product.carbohydrates,
  imageUrl: product.imageUrl,
  isAvailable: product.isAvailable,
  categoryId: product.categoryId,
  category: product.category?.code || null,
  categoryName: product.category?.name || null,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(products.map(normalizeProduct));
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
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json(normalizeProduct(product));
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

    const foundCategory = await prisma.category.findUnique({
      where: { code: category.trim() },
    });

    if (!foundCategory) {
      return res.status(400).json({
        message: "Выбрана несуществующая категория",
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
        categoryId: foundCategory.id,
        imageUrl: imageUrl || null,
        isAvailable: Number(quantity) > 0,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(normalizeProduct(createdProduct));
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

    let categoryId = undefined;

    if (category) {
      const foundCategory = await prisma.category.findUnique({
        where: { code: category.trim() },
      });

      if (!foundCategory) {
        return res.status(400).json({
          message: "Выбрана несуществующая категория",
        });
      }

      categoryId = foundCategory.id;
    }

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
        categoryId,
        imageUrl: imageUrl || null,
        isAvailable: Number(quantity) > 0,
      },
      include: {
        category: true,
      },
    });

    res.json(normalizeProduct(updatedProduct));
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
        message: "Нельзя удалить товар, так как он уже используется в заказах",
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
      include: {
        category: true,
      },
    });

    res.json(normalizeProduct(updatedProduct));
  } catch (error) {
    console.error("Ошибка при обновлении остатка:", error);
    res.status(500).json({ message: "Не удалось обновить остаток товара" });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    const normalized = categories.map((category) => ({
      id: category.id,
      value: category.code,
      label: category.name,
      code: category.code,
      name: category.name,
      productsCount: category._count.products,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Ошибка при получении категорий товара:", error);
    res.status(500).json({ message: "Не удалось получить категории" });
  }
};