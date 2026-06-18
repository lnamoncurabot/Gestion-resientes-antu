import { pool } from "../config/db.js";
import type { RowDataPacket } from "mysql2";

export async function buscarResidentes(search: string) {
  const like = `%${search.trim()}%`;
  const [rows] = await pool.execute(
    `SELECT id, nombre_completo, rut, edad_texto, sexo, fecha_ingreso, peso_inicial_kg, estado
     FROM residentes
     WHERE estado = 'Activo'
       AND (:search = '' OR nombre_completo LIKE :like OR rut LIKE :like)
     ORDER BY nombre_completo
     LIMIT 15`,
    { search: search.trim(), like }
  );
  return rows as RowDataPacket[];
}

export async function obtenerResidente(id: number) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM v_residentes_activos
     WHERE id = :id
     LIMIT 1`,
    { id }
  );
  const typedRows = rows as RowDataPacket[];
  return typedRows[0] ?? null;
}
