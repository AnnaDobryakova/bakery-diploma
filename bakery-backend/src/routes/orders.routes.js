import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByEmail,
  updateOrderStatus,
} from "../controllers/orders.controller.js";

const router = Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/by-email", getOrdersByEmail);
router.patch("/:id/status", updateOrderStatus);

export default router;