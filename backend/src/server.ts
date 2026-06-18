import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { residentesRouter } from "./routes/residentes.routes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "gestion-residentes-antu-api" });
});

app.use("/api/residentes", residentesRouter);
app.use("/api/residentes", dashboardRouter);

app.listen(port, () => {
  console.log(`API Gestion Residentes Antu escuchando en http://localhost:${port}/api`);
});
