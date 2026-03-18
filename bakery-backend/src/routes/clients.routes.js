import { Router } from "express";
import { getAllClients } from "../controllers/clients.controller.js";

const router = Router();

router.get("/", getAllClients);

export default router;