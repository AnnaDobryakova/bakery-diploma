import prisma from "../prisma.js";

export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(promotions);
  } catch (error) {
    console.error("Ошибка при получении акций:", error);
    res.status(500).json({ message: "Не удалось получить акции" });
  }
};

export const getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await prisma.promotion.findUnique({
      where: { id: Number(id) },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Акция не найдена" });
    }

    res.json(promotion);
  } catch (error) {
    console.error("Ошибка при получении акции:", error);
    res.status(500).json({ message: "Не удалось получить акцию" });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const {
      title,
      type,
      value,
      promoCode,
      startDate,
      endDate,
      status,
      restrictions,
      imageUrl,
    } = req.body;

    if (!title || !type || !value || !startDate || !endDate || !status) {
      return res.status(400).json({
        message: "Не заполнены обязательные поля",
      });
    }

    const createdPromotion = await prisma.promotion.create({
      data: {
        title: title.trim(),
        type: type.trim(),
        value: value.toString().trim(),
        promoCode: promoCode?.trim() || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status.trim(),
        restrictions: restrictions?.trim() || null,
        imageUrl: imageUrl || null,
      },
    });

    res.status(201).json(createdPromotion);
  } catch (error) {
    console.error("Ошибка при создании акции:", error);
    res.status(500).json({ message: "Не удалось создать акцию" });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      type,
      value,
      promoCode,
      startDate,
      endDate,
      status,
      restrictions,
      imageUrl,
    } = req.body;

    const updatedPromotion = await prisma.promotion.update({
      where: { id: Number(id) },
      data: {
        title: title.trim(),
        type: type.trim(),
        value: value.toString().trim(),
        promoCode: promoCode?.trim() || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status.trim(),
        restrictions: restrictions?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
      },
    });

    res.json(updatedPromotion);
  } catch (error) {
    console.error("Ошибка при обновлении акции:", error);
    res.status(500).json({ message: "Не удалось обновить акцию" });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.promotion.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Акция успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении акции:", error);
    res.status(500).json({ message: "Не удалось удалить акцию" });
  }
};