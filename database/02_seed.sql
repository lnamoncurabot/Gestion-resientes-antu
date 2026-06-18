-- Gestion Residentes Antu
-- 02_seed.sql
-- Ejecutar despues de 01_schema.sql.

USE gestion_residentes_antu;

INSERT INTO roles (codigo, nombre, descripcion) VALUES
('administrador', 'Administrador', 'Gestion completa del sistema.'),
('administrador_respaldo', 'Administrador respaldo', 'Mismos permisos del administrador principal.'),
('cam', 'CAM / Cuidadora', 'Registro operativo diario de cuidados, ciclos y medicamentos.'),
('directora_tecnica', 'Directora Tecnica', 'Seguimiento tecnico y evolucion semanal.'),
('enfermero', 'Enfermero', 'Seguimiento clinico, formularios y dashboard de residentes.'),
('nutricionista', 'Nutricionista', 'Seguimiento nutricional y regimenes.'),
('lectura', 'Consulta / lectura', 'Acceso solo lectura segun permisos futuros.');

INSERT INTO usuarios (nombre, email, password_hash, activo, ventana_edicion_horas) VALUES
('Marcelo Namoncura Poblete', 'administracion@hogarantu.cl', NULL, 1, 16),
('Luis Namoncura Poblete', 'administracion_respaldo@hogarantu.cl', NULL, 1, 16),
('Carlos Contreras', 'enfermero@hogarantu.cl', NULL, 1, 16),
('Nutri', 'nutricion@hogarantu.cl', NULL, 1, 16),
('Directora tecnica', 'dt@hogarantu.cl', NULL, 1, 16),
('CAM1', 'cam-dia@hogarantu.cl', NULL, 1, 16),
('CAM2', 'cam-noche@hogarantu.cl', NULL, 1, 16);

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON (
  (u.email = 'administracion@hogarantu.cl' AND r.codigo = 'administrador')
  OR (u.email = 'administracion_respaldo@hogarantu.cl' AND r.codigo = 'administrador_respaldo')
  OR (u.email = 'enfermero@hogarantu.cl' AND r.codigo = 'enfermero')
  OR (u.email = 'nutricion@hogarantu.cl' AND r.codigo = 'nutricionista')
  OR (u.email = 'dt@hogarantu.cl' AND r.codigo = 'directora_tecnica')
  OR (u.email IN ('cam-dia@hogarantu.cl', 'cam-noche@hogarantu.cl') AND r.codigo = 'cam')
);

INSERT INTO umbrales_ciclos (variable_codigo, nombre, unidad, limite_inferior, limite_superior) VALUES
('temperatura_c', 'Temperatura', 'C', 36.00, 37.50),
('saturacion_oxigeno', 'Saturacion SpO2', '%', 95.00, 100.00),
('presion_diastolica', 'Presion diastolica', 'mmHg', 60.00, 89.00),
('hgt_glucosa_mg_dl', 'HGT / Glucosa', 'mg/dL', 70.00, 180.00);

INSERT INTO residentes (
  id, nombre_completo, rut, edad_texto, sexo, fecha_ingreso, peso_inicial_kg,
  patologias_ingreso, servicio_urgencia, estado
) VALUES
(1, 'Isabel Del Carmen Viceion Osorio', '5.335.013-5', '83 anos', 'Femenino', '2024-09-01', 60.60, 'Diabetes Mellitus tipo 2, Hipertension Arterial, Demencia', 'SAMU', 'Activo'),
(2, 'Irene Carolina Parkes Carrasco', '4.508.231-8', '80 anos', 'Femenino', '2024-12-03', 34.60, 'Hipertension Arterial, Parkinson, Deterioro Cognitivo', 'EMECAR', 'Activo'),
(3, 'Maria Isabel Leinenweber Bravo', '5.036.161-6', '78 anos', 'Femenino', '2019-07-14', 45.50, 'Deterioro Cognitivo, Hipertension Arterial', 'SAMU', 'Activo'),
(4, 'Sara Quiros Muller', '4.898.901-2', '80 anos', 'Femenino', '2025-01-26', 41.50, 'Postracion, desnutricion, escaras, cancer de mama antiguo', 'SAMU', 'Activo'),
(5, 'Beatriz Del Carmen Vera Llanos', '5.486.820-0', '93 anos', 'Femenino', '2019-07-19', 46.50, 'Hipertension Arterial, Deterioro Cognitivo, Dismovilidad', 'SAMU', 'Activo'),
(6, 'Rossana del Carmen Silva Vilches', '7.497.569-0', '68 anos', 'Femenino', '2020-01-25', 53.60, 'Demencia, enfermedad de Parkinson, Depresion', 'SAMU', 'Activo'),
(7, 'Hortensia Martinez Franco', '3.166.817-4', '91 anos', 'Femenino', '2026-04-06', 58.70, 'Deterioro Cognitivo Mayor', 'SAMU', 'Activo'),
(8, 'Silvia Guzman Newson', '2.716.675-K', '93 anos', 'Femenino', '2021-07-22', 47.10, 'Hipertension Arterial', 'SAMU', 'Activo'),
(9, 'Aida Cecilia Lara Ponce', '5.233.396-2', '85 anos', 'Femenino', '2026-04-30', 43.60, 'Deterioro Cognitivo Mayor', 'SAMU', 'Activo'),
(10, 'Jerman Silva Navarrete', '4.126.362-8', '87 anos', 'Masculino', '2025-12-02', 61.20, 'Cancer de prostata, ACV, Deterioro Cognitivo, Hipertension Arterial, Diabetes Mellitus', 'Policlinico Naval', 'Activo'),
(11, 'Myriam Maruri Koppmann', '4.486.986-1', '86 anos', 'Femenino', '2023-10-26', 56.80, 'Deterioro Cognitivo Mayor Mixto, Dismovilidad Leve', 'SAMU', 'Activo'),
(12, 'Jose Omar Bravo Rodriguez', '3.695.879-0', '100 anos', 'Masculino', '2024-03-28', 59.00, 'Diabetes Mellitus, Hipertension arterial, hipotiroidismo, hiperglicemia', 'EMECAR', 'Activo'),
(13, 'Carlos Senarega Vasquez', '5.442.578-3', '79 anos', 'Masculino', '2025-05-05', 73.50, 'Deterioro Cognitivo, Delirio hiperactivo', 'EMECAR', 'Activo'),
(14, 'Luis Pardo Arias', '3.855.451-4', '86 anos', 'Masculino', '2022-10-25', 56.60, 'Hipertension Arterial, Demencia Mixta, ACV antiguo', 'Clinica ACME', 'Activo'),
(15, 'Nivea Susana Sepulveda Poirrier', '4.290.691-3', '88 anos', 'Femenino', '2020-12-25', 46.30, 'Antecedentes clinicos pendientes de normalizar', 'SAMU', 'Activo');

INSERT INTO apoderados (
  residente_id, nombre, telefono, email, contacto_sos_nombre, contacto_sos_telefono, es_contacto_principal
) VALUES
(1, 'Ruben Tapia', '9 8196 6212', 'chelo.namoncura@gmail.com', 'Karla Hormazabal', '9 3373 2387', 1),
(2, 'Pablo Verdejo', '9 6619 7409', 'pablo.verdejo@gmail.com', 'Eduardo Verdejo', '9 9942 3334', 1),
(3, 'Carlos Longhi', '9 7857 9279', 'gclonghi@gmail.com', 'Don Caco', '9 7857 9279', 1),
(4, 'Francisco Yuseff', '9 8868 5910', 'franciscoyuseff@gmail.com', 'Ignacio', '9 6407 7804', 1),
(5, 'Ivon Poblete', '9 6699 5192', 'carenave@gmail.com', 'Carlos Nakamura Vera', '9 52222138', 1),
(6, 'Katherine Figueroa', '9 4440 5227', 'katherine.figueroa.silva@gmail.com', 'Ivan Figueroa', '9 8889 0273', 1),
(7, 'Ximena Vargas', '9 8774 0278', 'chelo.namoncura@gmail.com', 'Ximena Vargas', '9 8774 0278', 1),
(8, 'Oriana Aninat', '9 8369 7509', 'toty2606@hotmail.com', 'Oriana Aninat', '9 8369 7509', 1),
(9, 'Nancy Alarcon', '9 9097 5021', 'nalarcon1975@gmail.com', 'Hans', '9 6591 8991', 1),
(10, 'Germania Silva', '9 7725 9932', 'gema.silva.h@gmail.com', 'Maritza Silva', '9 6619 9472', 1),
(11, 'Jessica Marchant', '9 9250 5518', 'jessicamarchant@gmail.com', 'Carlos Marchant', '9 9410 5064', 1),
(12, 'Ximena Bravo', '9 7695 3779', 'ximebravosanhueza16@gmail.com', 'Veronica Bravo', '9 8198 9874', 1),
(13, 'Fabiola Llanos', '9 6607 5023', 'fabiolallanosdonoso@gmail.com', 'Humberto', '9 7977 2674', 1),
(14, 'Maria Cecilia Pardo', '9 9280 2564', 'mariapardopeq@gmail.com', 'Maria Cecilia Pardo', '9 9280 2564', 1),
(15, 'Claudia Soto', '9 9204 2455', 'claudiasotosep2@gmail.com', 'Sabrina Soto', '9 9677 3683', 1);

INSERT INTO controles_peso (residente_id, usuario_id, fecha_control, peso_kg, regimen_indicado, origen)
SELECT id, NULL, fecha_ingreso, peso_inicial_kg, 'Peso inicial registrado al ingreso.', 'Ingreso'
FROM residentes
WHERE peso_inicial_kg IS NOT NULL AND fecha_ingreso IS NOT NULL;
