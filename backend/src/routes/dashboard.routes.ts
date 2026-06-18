import { Router } from "express";
import { obtenerDashboardResidente } from "../services/dashboard.service.js";

export const dashboardRouter = Router();

dashboardRouter.get("/:id/dashboard", async (req, res, next) => {
  try {
    const dashboard = await obtenerDashboardResidente(Number(req.params.id));
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
});
