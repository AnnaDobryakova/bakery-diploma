import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductCategories,
  updateProduct,
  updateProductStock,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/categories", getProductCategories);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/stock", updateProductStock);

export default router;