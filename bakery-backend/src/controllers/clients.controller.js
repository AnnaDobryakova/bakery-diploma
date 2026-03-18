import prisma from "../prisma.js";

export const getAllClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        orders: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    const normalizedClients = clients.map((client) => ({
      id: client.id,
      name: client.fullName,
      phone: client.phone || "—",
      email: client.email,
      registrationDate: client.createdAt,
      status: client.status === "active" ? "Активен" : "Неактивен",
      ordersCount: client.orders.length,
    }));

    res.json(normalizedClients);
  } catch (error) {
    console.error("Ошибка при получении клиентов:", error);
    res.status(500).json({ message: "Не удалось получить клиентов" });
  }
};