import prisma from "../prisma.js";

export const createOrder = async (req, res) => {
  try {
    const { client, pickupTime, items, comment } = req.body;

    if (!client?.email || !client?.fullName || !items?.length) {
      return res.status(400).json({ message: "Некорректные данные заказа" });
    }

    let existingClient = await prisma.client.findUnique({
      where: { email: client.email },
    });

    if (!existingClient) {
      existingClient = await prisma.client.create({
        data: {
          fullName: client.fullName,
          phone: client.phone || null,
          email: client.email,
        },
      });
    }

    const productIds = items.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`Товар с id ${item.productId} не найден`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Недостаточно товара "${product.name}" на складе`);
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      };
    });

    const totalAmount = orderItemsData.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          clientId: existingClient.id,
          pickupTime: pickupTime ? new Date(pickupTime) : null,
          comment: comment || null,
          totalAmount,
          status: "new",
          items: {
            create: orderItemsData,
          },
        },
        include: {
          client: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of orderItemsData) {
        const product = products.find((p) => p.id === item.productId);
        const newQuantity = product.quantity - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: newQuantity,
            isAvailable: newQuantity > 0,
          },
        });
      }

      return createdOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    res.status(500).json({ message: error.message || "Не удалось создать заказ" });
  }
};