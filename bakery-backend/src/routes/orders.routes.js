// import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByEmail,
  updateOrderStatus,
} from "../controllers/orders.controller.js";

import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/by-email", getOrdersByEmail);
router.patch("/:id/status", updateOrderStatus);

router.put("/mark-viewed", async (req, res) => {
  try {
    const result = await prisma.order.updateMany({
      where: {
        status: "new",
      },
      data: {
        status: "in_progress",
      },
    });

    res.json({
      message: "Новые заказы помечены как просмотренные",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Ошибка при обновлении статусов заказов:", error);
    res.status(500).json({ error: "Ошибка при обновлении статусов заказов" });
  }
});

export default router;