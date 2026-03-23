import prisma from "../prisma.js";

export const getAllCategories = async (req, res) => {
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
      description: category.description,
      productsCount: category._count.products,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    res.status(500).json({ message: "Не удалось получить категории" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    res.json({
      id: category.id,
      name: category.name,
      code: category.code,
      description: category.description,
    });
  } catch (error) {
    console.error("Ошибка при получении категории:", error);
    res.status(500).json({ message: "Не удалось получить категорию" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: "Не заполнены обязательные поля",
      });
    }

    const normalizedCode = code.trim().toLowerCase();

    const existingCategory = await prisma.category.findUnique({
      where: { code: normalizedCode },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Категория с таким кодом уже существует",
      });
    }

    const createdCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        code: normalizedCode,
        description: description?.trim() || null,
      },
    });

    res.status(201).json({
      id: createdCategory.id,
      name: createdCategory.name,
      code: createdCategory.code,
      description: createdCategory.description,
    });
  } catch (error) {
    console.error("Ошибка при создании категории:", error);
    res.status(500).json({ message: "Не удалось создать категорию" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;

    const normalizedCode = code.trim().toLowerCase();

    const existingCategory = await prisma.category.findFirst({
      where: {
        code: normalizedCode,
        NOT: {
          id: Number(id),
        },
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Категория с таким кодом уже существует",
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name: name.trim(),
        code: normalizedCode,
        description: description?.trim() || null,
      },
    });

    res.json({
      id: updatedCategory.id,
      name: updatedCategory.name,
      code: updatedCategory.code,
      description: updatedCategory.description,
    });
  } catch (error) {
    console.error("Ошибка при обновлении категории:", error);
    res.status(500).json({ message: "Не удалось обновить категорию" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryId = Number(id);

    const relatedProducts = await prisma.product.findFirst({
      where: { categoryId },
    });

    if (relatedProducts) {
      return res.status(400).json({
        message: "Нельзя удалить категорию, так как в ней есть товары",
      });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    res.json({ message: "Категория успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении категории:", error);
    res.status(500).json({ message: "Не удалось удалить категорию" });
  }
};