import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import clientsRouter from "./routes/clients.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import promotionsRoutes from "./routes/promotions.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.get("/", (req, res) => {
  res.json({ message: "Bakery backend is running" });
});

app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/clients", clientsRouter);
app.use("/api/employees", employeeRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/promotions", promotionsRoutes);

export default app;