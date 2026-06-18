-- Gestion Residentes Antu
-- 04_seed_demo_30_dias.sql
-- Ejecutar despues de 01_schema.sql, 02_seed.sql y 03_views_queries.sql.
-- Genera data ficticia de 30 dias para pruebas locales.

USE gestion_residentes_antu;

SET @OLD_SQL_SAFE_UPDATES = @@SQL_SAFE_UPDATES;
SET SQL_SAFE_UPDATES = 0;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM alertas;
DELETE FROM administraciones_medicamentos;
DELETE FROM controles_ciclos;
DELETE FROM registros_cam;
DELETE FROM registros_profesionales;
DELETE FROM registros_nutricion;
DELETE FROM controles_peso WHERE origen <> 'Ingreso';
SET FOREIGN_KEY_CHECKS = 1;

DROP PROCEDURE IF EXISTS sp_seed_demo_30_dias;

DELIMITER $$

CREATE PROCEDURE sp_seed_demo_30_dias()
BEGIN
  DECLARE v_residente_id INT DEFAULT 1;
  DECLARE v_day INT DEFAULT 0;
  DECLARE v_hour_index INT DEFAULT 0;
  DECLARE v_fecha_base DATE DEFAULT '2026-05-16';
  DECLARE v_fecha_hora DATETIME;
  DECLARE v_usuario_cam_id INT;
  DECLARE v_usuario_dt_id INT;
  DECLARE v_usuario_enf_id INT;
  DECLARE v_usuario_nutri_id INT;
  DECLARE v_registro_cam_id BIGINT;
  DECLARE v_temp DECIMAL(4,1);
  DECLARE v_spo2 DECIMAL(5,2);
  DECLARE v_pas INT;
  DECLARE v_pad INT;
  DECLARE v_hgt DECIMAL(6,2);
  DECLARE v_turno VARCHAR(10);
  DECLARE v_cuidadora VARCHAR(150);
  DECLARE v_tipo VARCHAR(150);
  DECLARE v_medicamento VARCHAR(180);
  DECLARE v_detalle TEXT;
  DECLARE v_peso_base DECIMAL(5,2);

  SELECT id INTO v_usuario_dt_id FROM usuarios WHERE email = 'dt@hogarantu.cl' LIMIT 1;
  SELECT id INTO v_usuario_enf_id FROM usuarios WHERE email = 'enfermero@hogarantu.cl' LIMIT 1;
  SELECT id INTO v_usuario_nutri_id FROM usuarios WHERE email = 'nutricion@hogarantu.cl' LIMIT 1;

  WHILE v_residente_id <= 15 DO
    SET v_day = 0;

    WHILE v_day < 30 DO
      SET v_hour_index = 0;

      WHILE v_hour_index < 3 DO
        SET v_fecha_hora = TIMESTAMP(
          DATE_ADD(v_fecha_base, INTERVAL v_day DAY),
          CASE v_hour_index
            WHEN 0 THEN '08:00:00'
            WHEN 1 THEN '14:00:00'
            ELSE '20:00:00'
          END
        );
        SET v_usuario_cam_id = (
          SELECT id
          FROM usuarios
          WHERE email = CASE WHEN v_hour_index = 2 THEN 'cam-noche@hogarantu.cl' ELSE 'cam-dia@hogarantu.cl' END
          LIMIT 1
        );
        SET v_turno = CASE WHEN v_hour_index = 2 THEN 'Noche' ELSE 'Dia' END;
        SET v_cuidadora = CASE WHEN v_hour_index = 2 THEN 'CAM2' ELSE 'CAM1' END;
        SET v_temp = ROUND(36.2 + MOD(v_residente_id * 17 + v_day * 5 + v_hour_index * 3, 12) * 0.12, 1);
        SET v_spo2 = 97 - MOD(v_residente_id * 17 + v_day * 5 + v_hour_index * 3, 5);
        SET v_pas = 116 + MOD(v_residente_id * 17 + v_day * 5 + v_hour_index * 3, 24);
        SET v_pad = 70 + MOD(v_residente_id * 17 + v_day * 5 + v_hour_index * 3, 24);
        SET v_hgt = 92 + MOD(v_residente_id * 17 + v_day * 5 + v_hour_index * 3, 75);
        SET v_medicamento = CASE
          WHEN v_hour_index <> 1 AND MOD(v_residente_id + v_day + v_hour_index, 2) = 0 THEN
            CASE MOD(v_residente_id + v_day + v_hour_index, 6)
              WHEN 0 THEN 'Losartan 50 mg'
              WHEN 1 THEN 'Metformina 850 mg'
              WHEN 2 THEN 'Quetiapina 25 mg'
              WHEN 3 THEN 'Levotiroxina 50 mcg'
              WHEN 4 THEN 'Amlodipino 5 mg'
              ELSE 'Paracetamol 500 mg'
            END
          ELSE ''
        END;
        SET v_tipo = CONCAT(
          'Control de ciclos',
          CASE WHEN v_medicamento <> '' THEN ' + Medicamento' ELSE '' END,
          CASE WHEN MOD(v_residente_id + v_day + v_hour_index, 5) = 0 THEN ' + Observacion' ELSE '' END
        );
        SET v_detalle = CONCAT(
          'Control registrado. Temp ', v_temp, ' C, Sat ', v_spo2, '%, PA ', v_pas, '/', v_pad, ', HGT ', v_hgt, '.',
          CASE WHEN v_medicamento <> '' THEN CONCAT(' Medicamento ', v_medicamento, ' administrado.') ELSE '' END,
          CASE WHEN MOD(v_residente_id + v_day + v_hour_index, 5) = 0 THEN ' Observacion: residente con evolucion diaria sin incidentes mayores.' ELSE '' END
        );

        INSERT INTO registros_cam (
          residente_id, usuario_id, fecha_hora, turno, nombre_cuidadora, tipo_registro, observaciones, editable_hasta
        ) VALUES (
          v_residente_id, v_usuario_cam_id, v_fecha_hora, v_turno, v_cuidadora, v_tipo, v_detalle,
          DATE_ADD(v_fecha_hora, INTERVAL 16 HOUR)
        );
        SET v_registro_cam_id = LAST_INSERT_ID();

        INSERT INTO controles_ciclos (
          registro_cam_id, residente_id, usuario_id, fecha_hora,
          temperatura_c, saturacion_oxigeno, presion_sistolica, presion_diastolica, hgt_glucosa_mg_dl,
          observaciones
        ) VALUES (
          v_registro_cam_id, v_residente_id, v_usuario_cam_id, v_fecha_hora,
          v_temp, v_spo2, v_pas, v_pad, v_hgt,
          'Control de ciclos demo.'
        );

        IF v_medicamento <> '' THEN
          INSERT INTO administraciones_medicamentos (
            registro_cam_id, residente_id, usuario_id, fecha_hora, nombre_medicamento,
            dosis, suministrado_por, observaciones
          ) VALUES (
            v_registro_cam_id, v_residente_id, v_usuario_cam_id, v_fecha_hora, v_medicamento,
            NULL, v_cuidadora, CONCAT('Usuario sistema: ', CASE WHEN v_hour_index = 2 THEN 'cam-noche@hogarantu.cl' ELSE 'cam-dia@hogarantu.cl' END)
          );
        END IF;

        IF v_temp > 37.5 THEN
          INSERT INTO alertas (residente_id, origen_tipo, origen_id, fecha_hora, variable, valor, nivel, accion_sugerida)
          VALUES (v_residente_id, 'Control Ciclos', v_registro_cam_id, v_fecha_hora, 'Temperatura', CONCAT(v_temp, ' C'), 'Alerta', 'Repetir control e informar a Enfermero si persiste.');
        END IF;

        IF v_spo2 < 95 THEN
          INSERT INTO alertas (residente_id, origen_tipo, origen_id, fecha_hora, variable, valor, nivel, accion_sugerida)
          VALUES (v_residente_id, 'Control Ciclos', v_registro_cam_id, v_fecha_hora, 'Saturacion SpO2', CONCAT(v_spo2, ' %'), 'Critico', 'Verificar equipo, evaluar signos respiratorios y avisar inmediatamente.');
        END IF;

        SET v_hour_index = v_hour_index + 1;
      END WHILE;

      SET v_day = v_day + 1;
    END WHILE;

    INSERT INTO registros_profesionales (
      residente_id, usuario_id, rol_profesional, fecha_hora, periodo_inicio, periodo_fin, evolucion, editable_hasta
    )
    SELECT v_residente_id, v_usuario_dt_id, 'Directora Tecnica',
      TIMESTAMP(DATE_ADD(v_fecha_base, INTERVAL d.day_offset DAY), '10:15:00'),
      DATE_SUB(DATE_ADD(v_fecha_base, INTERVAL d.day_offset DAY), INTERVAL 6 DAY),
      DATE_ADD(v_fecha_base, INTERVAL d.day_offset DAY),
      CONCAT('Revision tecnica semana ', d.week_number, '. Se revisa bitacora CAM, estado general, adherencia a cuidados y necesidad de seguimiento.'),
      DATE_ADD(TIMESTAMP(DATE_ADD(v_fecha_base, INTERVAL d.day_offset DAY), '10:15:00'), INTERVAL 16 HOUR)
    FROM (
      SELECT 3 AS day_offset, 1 AS week_number UNION ALL
      SELECT 10, 2 UNION ALL
      SELECT 17, 3 UNION ALL
      SELECT 24, 4 UNION ALL
      SELECT 29, 5
    ) d;

    INSERT INTO registros_profesionales (
      residente_id, usuario_id, rol_profesional, fecha_hora, periodo_inicio, periodo_fin, evolucion, editable_hasta
    )
    SELECT v_residente_id, v_usuario_enf_id, 'Enfermero',
      TIMESTAMP(DATE_ADD(v_fecha_base, INTERVAL d.day_offset DAY), '11:40:00'),
      DATE_SUB(DATE_ADD(v_fecha_base, INTERVAL d.day_offset DAY), INTERVAL 6 DAY),
      DATE_ADD(v_fecha_base, INTERVAL d.day_offset DAY),
      CONCAT('Revision clinica semana ', d.week_number, '. Se revisan ciclos, medicamentos suministrados y alertas abiertas del periodo.'),
      DATE_ADD(TIMESTAMP(DATE_ADD(v_fecha_base, INTERVAL d.day_offset DAY), '11:40:00'), INTERVAL 16 HOUR)
    FROM (
      SELECT 3 AS day_offset, 1 AS week_number UNION ALL
      SELECT 10, 2 UNION ALL
      SELECT 17, 3 UNION ALL
      SELECT 24, 4 UNION ALL
      SELECT 29, 5
    ) d;

    SELECT peso_inicial_kg INTO v_peso_base FROM residentes WHERE id = v_residente_id LIMIT 1;

    INSERT INTO registros_nutricion (
      residente_id, usuario_id, fecha_hora, peso_kg, talla_m, imc, clasificacion_imc, regimen_indicado, observaciones, editable_hasta
    ) VALUES
    (
      v_residente_id, v_usuario_nutri_id, TIMESTAMP(DATE_ADD(v_fecha_base, INTERVAL 8 DAY), '12:30:00'),
      ROUND(v_peso_base + MOD(v_residente_id, 3) * 0.1 - 0.3, 1), 1.60,
      ROUND((v_peso_base / (1.60 * 1.60)), 1), 'Seguimiento', 'Regimen mensual segun tolerancia.',
      'Control nutricional del periodo. Mantener minuta indicada y reforzar hidratacion.',
      DATE_ADD(TIMESTAMP(DATE_ADD(v_fecha_base, INTERVAL 8 DAY), '12:30:00'), INTERVAL 16 HOUR)
    ),
    (
      v_residente_id, v_usuario_nutri_id, TIMESTAMP(DATE_ADD(v_fecha_base, INTERVAL 29 DAY), '12:30:00'),
      ROUND(v_peso_base + MOD(v_residente_id, 3) * 0.1 + 0.2, 1), 1.60,
      ROUND(((v_peso_base + 0.2) / (1.60 * 1.60)), 1), 'Seguimiento', 'Actualizar regimen si existen cambios de peso o tolerancia.',
      'Control nutricional mensual. Revisar evolucion de peso y adherencia a minuta.',
      DATE_ADD(TIMESTAMP(DATE_ADD(v_fecha_base, INTERVAL 29 DAY), '12:30:00'), INTERVAL 16 HOUR)
    );

    INSERT INTO controles_peso (residente_id, usuario_id, fecha_control, peso_kg, regimen_indicado, origen)
    VALUES (
      v_residente_id, v_usuario_nutri_id, DATE_ADD(v_fecha_base, INTERVAL 29 DAY),
      ROUND(v_peso_base + MOD(v_residente_id, 3) * 0.1 + 0.2, 1),
      'Control mensual demo generado desde nutricion.',
      'Nutricionista'
    )
    ON DUPLICATE KEY UPDATE
      peso_kg = VALUES(peso_kg),
      regimen_indicado = VALUES(regimen_indicado),
      origen = VALUES(origen);

    SET v_residente_id = v_residente_id + 1;
  END WHILE;
END$$

DELIMITER ;

CALL sp_seed_demo_30_dias();
DROP PROCEDURE IF EXISTS sp_seed_demo_30_dias;

SELECT 'residentes' AS tabla, COUNT(*) AS total FROM residentes
UNION ALL SELECT 'registros_cam', COUNT(*) FROM registros_cam
UNION ALL SELECT 'controles_ciclos', COUNT(*) FROM controles_ciclos
UNION ALL SELECT 'administraciones_medicamentos', COUNT(*) FROM administraciones_medicamentos
UNION ALL SELECT 'registros_profesionales', COUNT(*) FROM registros_profesionales
UNION ALL SELECT 'registros_nutricion', COUNT(*) FROM registros_nutricion
UNION ALL SELECT 'alertas', COUNT(*) FROM alertas;

SET SQL_SAFE_UPDATES = @OLD_SQL_SAFE_UPDATES;
