import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import clientsRouter from "./routes/clients.routes.js";
import employeeRoutes from "./routes/employee.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Bakery backend is running" });
});

app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/clients", clientsRouter);
app.use("/api/employees", employeeRoutes);

export default app;