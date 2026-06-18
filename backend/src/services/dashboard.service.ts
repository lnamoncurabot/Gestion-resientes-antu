import { pool } from "../config/db.js";
import { obtenerResidente } from "./residentes.service.js";
import type { RowDataPacket } from "mysql2";

export async function obtenerDashboardResidente(residenteId: number) {
  const residente = await obtenerResidente(residenteId);
  const [bitacora] = await pool.execute(
    `SELECT *
     FROM v_bitacora_resumen
     WHERE residente_id = :residenteId
       AND (
         (origen = 'CAM' AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 5 DAY))
         OR (origen IN ('Directora Tecnica', 'Enfermero') AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 1 MONTH))
         OR origen = 'Nutricionista'
       )
     ORDER BY fecha_hora DESC`,
    { residenteId }
  );
  const [controlesCiclos] = await pool.execute(
    `SELECT *
     FROM v_controles_ciclos
     WHERE residente_id = :residenteId
       AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 5 DAY)
     ORDER BY fecha_hora ASC`,
    { residenteId }
  );
  const [medicamentos] = await pool.execute(
    `SELECT *
     FROM v_control_medicamentos
     WHERE residente_id = :residenteId
       AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 5 DAY)
     ORDER BY fecha_hora DESC`,
    { residenteId }
  );
  const [pesoMensual] = await pool.execute(
    `SELECT fecha_control, peso_kg, regimen_indicado, origen
     FROM controles_peso
     WHERE residente_id = :residenteId
     ORDER BY fecha_control ASC`,
    { residenteId }
  );

  return {
    residente,
    bitacora: bitacora as RowDataPacket[],
    controlesCiclos: controlesCiclos as RowDataPacket[],
    medicamentos: medicamentos as RowDataPacket[],
    pesoMensual: pesoMensual as RowDataPacket[]
  };
}
