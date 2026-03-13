import { Router } from "express";
import {
  getAllProducts,
  updateProductStock,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getAllProducts);
router.patch("/:id/stock", updateProductStock);

export default router;