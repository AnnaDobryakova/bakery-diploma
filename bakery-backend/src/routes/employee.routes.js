import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET all employees
router.get("/", async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

// POST create employee
router.post("/", async (req, res) => {
  const data = req.body;

  const employee = await prisma.employee.create({
    data,
  });

  res.json(employee);
});

export default router;