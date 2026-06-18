-- Gestion Residentes Antu
-- 03_views_queries.sql
-- Ejecutar despues de 01_schema.sql y 02_seed.sql.

USE gestion_residentes_antu;

DROP VIEW IF EXISTS v_bitacora_resumen;
DROP VIEW IF EXISTS v_control_medicamentos;
DROP VIEW IF EXISTS v_controles_ciclos;
DROP VIEW IF EXISTS v_residentes_activos;

CREATE VIEW v_residentes_activos AS
SELECT
  r.id,
  r.nombre_completo,
  r.rut,
  r.edad_texto,
  r.sexo,
  r.fecha_ingreso,
  r.peso_inicial_kg,
  r.patologias_ingreso,
  r.servicio_urgencia,
  a.nombre AS apoderado_nombre,
  a.telefono AS apoderado_telefono,
  a.email AS apoderado_email,
  a.contacto_sos_nombre,
  a.contacto_sos_telefono
FROM residentes r
LEFT JOIN apoderados a ON a.residente_id = r.id AND a.es_contacto_principal = 1
WHERE r.estado = 'Activo';

CREATE VIEW v_controles_ciclos AS
SELECT
  cc.id,
  cc.residente_id,
  r.nombre_completo AS residente,
  cc.usuario_id,
  u.nombre AS usuario,
  cc.fecha_hora,
  cc.temperatura_c,
  cc.saturacion_oxigeno,
  cc.presion_sistolica,
  cc.presion_diastolica,
  cc.hgt_glucosa_mg_dl,
  cc.observaciones
FROM controles_ciclos cc
JOIN residentes r ON r.id = cc.residente_id
JOIN usuarios u ON u.id = cc.usuario_id;

CREATE VIEW v_control_medicamentos AS
SELECT
  am.id,
  am.residente_id,
  r.nombre_completo AS residente,
  am.fecha_hora,
  am.nombre_medicamento,
  am.dosis,
  am.suministrado_por,
  u.nombre AS usuario_sistema,
  am.observaciones
FROM administraciones_medicamentos am
JOIN residentes r ON r.id = am.residente_id
JOIN usuarios u ON u.id = am.usuario_id;

CREATE VIEW v_bitacora_resumen AS
SELECT
  rc.residente_id,
  rc.fecha_hora,
  CAST('CAM' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS origen,
  CAST(rc.tipo_registro AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS tipo,
  CAST(CONCAT('Cuidadora: ', rc.nombre_cuidadora, '. Turno: ', rc.turno, '. ', COALESCE(rc.observaciones, '')) AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS detalle
FROM registros_cam rc
UNION ALL
SELECT
  rp.residente_id,
  rp.fecha_hora,
  CAST(rp.rol_profesional AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS origen,
  CAST('Evolucion profesional' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS tipo,
  CAST(rp.evolucion AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS detalle
FROM registros_profesionales rp
UNION ALL
SELECT
  rn.residente_id,
  rn.fecha_hora,
  CAST('Nutricionista' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS origen,
  CAST('Registro nutricional' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS tipo,
  CAST(CONCAT(
    'IMC: ', COALESCE(CAST(rn.imc AS CHAR), 'sin dato'),
    '. Regimen: ', COALESCE(rn.regimen_indicado, 'sin dato'),
    '. ', COALESCE(rn.observaciones, '')
  ) AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS detalle
FROM registros_nutricion rn;

-- Consulta base: buscador predictivo de residentes por nombre o RUT.
-- Reemplazar :texto por el termino escrito por el usuario.
/*
SELECT id, nombre_completo, rut
FROM residentes
WHERE estado = 'Activo'
  AND (
    nombre_completo LIKE CONCAT('%', :texto, '%')
    OR rut LIKE CONCAT('%', :texto, '%')
  )
ORDER BY nombre_completo
LIMIT 10;
*/

-- Consulta base: bitacora resumen de un residente.
-- Regla funcional: CAM ultimos 5 dias, DT/Enfermero ultimo mes, Nutricionista disponible.
/*
SELECT *
FROM v_bitacora_resumen
WHERE residente_id = :residente_id
  AND (
    (origen = 'CAM' AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 5 DAY))
    OR (origen IN ('Directora Tecnica', 'Enfermero') AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 1 MONTH))
    OR origen = 'Nutricionista'
  )
ORDER BY fecha_hora DESC;
*/

-- Consulta base: graficas de ciclos ultimos 5 dias, 3 lecturas diarias esperadas.
/*
SELECT *
FROM v_controles_ciclos
WHERE residente_id = :residente_id
  AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 5 DAY)
ORDER BY fecha_hora ASC;
*/

-- Consulta base: medicamentos ultimos 5 dias.
/*
SELECT *
FROM v_control_medicamentos
WHERE residente_id = :residente_id
  AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 5 DAY)
ORDER BY fecha_hora DESC;
*/

-- Consulta base: peso mensual.
/*
SELECT fecha_control, peso_kg, regimen_indicado, origen
FROM controles_peso
WHERE residente_id = :residente_id
ORDER BY fecha_control ASC;
*/
