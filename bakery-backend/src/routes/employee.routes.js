import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET all employees
router.get("/", async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({ error: "Сотрудник не найден" });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении сотрудника" });
  }
});

// POST create employee
router.post("/", async (req, res) => {
  const data = req.body;

  const employee = await prisma.employee.create({
    data,
  });

  res.json(employee);
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data,
    });

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при обновлении сотрудника" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.employee.delete({
      where: { id },
    });

    res.json({ message: "Сотрудник удалён" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при удалении сотрудника" });
  }
});

export default router;