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
    } else {
      // необязательно, но полезно: обновлять имя/телефон клиента
      existingClient = await prisma.client.update({
        where: { id: existingClient.id },
        data: {
          fullName: client.fullName,
          phone: client.phone || existingClient.phone,
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

    return res.status(201).json(order);
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    return res
      .status(500)
      .json({ message: error.message || "Не удалось создать заказ" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Ошибка при получении всех заказов:", error);
    return res
      .status(500)
      .json({ message: error.message || "Не удалось получить заказы" });
  }
};

export const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email не передан" });
    }

    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return res.status(200).json([]);
    }

    const orders = await prisma.order.findMany({
      where: { clientId: client.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Ошибка при получении заказов по email:", error);
    return res
      .status(500)
      .json({ message: error.message || "Не удалось получить заказы пользователя" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Не передан id заказа" });
    }

    if (!status) {
      return res.status(400).json({ message: "Не передан новый статус" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    return res
      .status(500)
      .json({ message: error.message || "Не удалось обновить статус заказа" });
  }
};