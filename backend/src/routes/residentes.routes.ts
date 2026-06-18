import { Router } from "express";
import { buscarResidentes, obtenerResidente } from "../services/residentes.service.js";

export const residentesRouter = Router();

residentesRouter.get("/", async (req, res, next) => {
  try {
    const search = String(req.query.search || "");
    const residentes = await buscarResidentes(search);
    res.json(residentes);
  } catch (error) {
    next(error);
  }
});

residentesRouter.get("/:id", async (req, res, next) => {
  try {
    const residente = await obtenerResidente(Number(req.params.id));
    if (!residente) {
      res.status(404).json({ message: "Residente no encontrado" });
      return;
    }
    res.json(residente);
  } catch (error) {
    next(error);
  }
});
