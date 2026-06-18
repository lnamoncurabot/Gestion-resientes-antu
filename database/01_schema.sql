-- Gestion Residentes Antu
-- 01_schema.sql
-- Ejecutar primero en MySQL Workbench.

CREATE DATABASE IF NOT EXISTS gestion_residentes_antu
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestion_residentes_antu;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS auditoria_eventos;
DROP TABLE IF EXISTS alertas;
DROP TABLE IF EXISTS controles_peso;
DROP TABLE IF EXISTS registros_nutricion;
DROP TABLE IF EXISTS registros_profesionales;
DROP TABLE IF EXISTS administraciones_medicamentos;
DROP TABLE IF EXISTS controles_ciclos;
DROP TABLE IF EXISTS registros_cam;
DROP TABLE IF EXISTS apoderados;
DROP TABLE IF EXISTS residentes;
DROP TABLE IF EXISTS usuario_roles;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS umbrales_ciclos;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  ventana_edicion_horas INT NOT NULL DEFAULT 16,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE usuario_roles (
  usuario_id INT NOT NULL,
  rol_id INT NOT NULL,
  PRIMARY KEY (usuario_id, rol_id),
  CONSTRAINT fk_usuario_roles_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_usuario_roles_rol
    FOREIGN KEY (rol_id) REFERENCES roles(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE residentes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(180) NOT NULL,
  rut VARCHAR(20) NOT NULL UNIQUE,
  fecha_nacimiento DATE NULL,
  edad_texto VARCHAR(30) NULL,
  sexo ENUM('Femenino', 'Masculino', 'Otro', 'No informado') NOT NULL DEFAULT 'No informado',
  fecha_ingreso DATE NULL,
  peso_inicial_kg DECIMAL(5,2) NULL,
  patologias_ingreso TEXT NULL,
  alergias TEXT NULL,
  habitacion VARCHAR(40) NULL,
  servicio_urgencia VARCHAR(120) NULL,
  estado ENUM('Activo', 'Inactivo', 'Egresado', 'Fallecido') NOT NULL DEFAULT 'Activo',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_residentes_nombre (nombre_completo),
  INDEX idx_residentes_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE apoderados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  residente_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  parentesco VARCHAR(80) NULL,
  telefono VARCHAR(50) NULL,
  email VARCHAR(180) NULL,
  contacto_sos_nombre VARCHAR(150) NULL,
  contacto_sos_telefono VARCHAR(50) NULL,
  es_contacto_principal TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_apoderados_residente
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
    ON DELETE CASCADE,
  INDEX idx_apoderados_residente (residente_id)
) ENGINE=InnoDB;

CREATE TABLE umbrales_ciclos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  variable_codigo VARCHAR(40) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  limite_inferior DECIMAL(8,2) NULL,
  limite_superior DECIMAL(8,2) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE registros_cam (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  residente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  turno ENUM('Dia', 'Noche', 'Otro') NOT NULL DEFAULT 'Dia',
  nombre_cuidadora VARCHAR(150) NOT NULL,
  tipo_registro VARCHAR(150) NOT NULL,
  observaciones TEXT NULL,
  editable_hasta DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_registros_cam_residente
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_registros_cam_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT,
  INDEX idx_registros_cam_residente_fecha (residente_id, fecha_hora),
  INDEX idx_registros_cam_usuario_fecha (usuario_id, fecha_hora)
) ENGINE=InnoDB;

CREATE TABLE controles_ciclos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  registro_cam_id BIGINT NOT NULL,
  residente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  temperatura_c DECIMAL(4,1) NULL,
  saturacion_oxigeno DECIMAL(5,2) NULL,
  presion_sistolica INT NULL,
  presion_diastolica INT NULL,
  hgt_glucosa_mg_dl DECIMAL(6,2) NULL,
  observaciones TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_controles_ciclos_registro_cam
    FOREIGN KEY (registro_cam_id) REFERENCES registros_cam(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_controles_ciclos_residente
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_controles_ciclos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT,
  INDEX idx_controles_ciclos_residente_fecha (residente_id, fecha_hora)
) ENGINE=InnoDB;

CREATE TABLE administraciones_medicamentos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  registro_cam_id BIGINT NOT NULL,
  residente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  nombre_medicamento VARCHAR(180) NOT NULL,
  dosis VARCHAR(80) NULL,
  suministrado_por VARCHAR(150) NOT NULL,
  observaciones TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_medicamentos_registro_cam
    FOREIGN KEY (registro_cam_id) REFERENCES registros_cam(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_medicamentos_residente
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_medicamentos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT,
  INDEX idx_medicamentos_residente_fecha (residente_id, fecha_hora)
) ENGINE=InnoDB;

CREATE TABLE registros_profesionales (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  residente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  rol_profesional ENUM('Directora Tecnica', 'Enfermero') NOT NULL,
  fecha_hora DATETIME NOT NULL,
  periodo_inicio DATE NULL,
  periodo_fin DATE NULL,
  evolucion TEXT NOT NULL,
  datos_json JSON NULL,
  editable_hasta DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_registros_prof_residente
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_registros_prof_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT,
  INDEX idx_registros_prof_residente_fecha (residente_id, fecha_hora),
  INDEX idx_registros_prof_rol_fecha (rol_profesional, fecha_hora)
) ENGINE=InnoDB;

CREATE TABLE registros_nutricion (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  residente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  peso_kg DECIMAL(5,2) NULL,
  talla_m DECIMAL(4,2) NULL,
  imc DECIMAL(5,2) NULL,
  clasificacion_imc VARCHAR(100) NULL,
  regimen_indicado VARCHAR(255) NULL,
  observaciones TEXT NULL,
  datos_json JSON NULL,
  editable_hasta DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_registros_nutri_residente
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_registros_nutri_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT,
  INDEX idx_registros_nutri_residente_fecha (residente_id, fecha_hora)
) ENGINE=InnoDB;

CREATE TABLE controles_peso (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  residente_id INT NOT NULL,
  usuario_id INT NULL,
  fecha_control DATE NOT NULL,
  peso_kg DECIMAL(5,2) NOT NULL,
  regimen_indicado VARCHAR(255) NULL,
  origen ENUM('Ingreso', 'Nutricionista', 'Mensual', 'Otro') NOT NULL DEFAULT 'Mensual',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_controles_peso_residente
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_controles_peso_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL,
  UNIQUE KEY uq_controles_peso_residente_fecha (residente_id, fecha_control),
  INDEX idx_controles_peso_residente_fecha (residente_id, fecha_control)
) ENGINE=InnoDB;

CREATE TABLE alertas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  residente_id INT NOT NULL,
  origen_tipo ENUM('Control Ciclos', 'Medicamento', 'Registro Profesional', 'Nutricion', 'Manual') NOT NULL,
  origen_id BIGINT NULL,
  fecha_hora DATETIME NOT NULL,
  variable VARCHAR(80) NULL,
  valor VARCHAR(80) NULL,
  nivel ENUM('Alerta', 'Critico') NOT NULL,
  estado ENUM('Abierta', 'Cerrada') NOT NULL DEFAULT 'Abierta',
  accion_sugerida TEXT NULL,
  comentario_cierre TEXT NULL,
  cerrada_por_usuario_id INT NULL,
  cerrada_en DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alertas_residente
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_alertas_cerrada_usuario
    FOREIGN KEY (cerrada_por_usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL,
  INDEX idx_alertas_residente_fecha (residente_id, fecha_hora),
  INDEX idx_alertas_estado_nivel (estado, nivel)
) ENGINE=InnoDB;

CREATE TABLE auditoria_eventos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL,
  entidad VARCHAR(80) NOT NULL,
  entidad_id BIGINT NULL,
  accion VARCHAR(80) NOT NULL,
  detalle_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_auditoria_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL,
  INDEX idx_auditoria_entidad (entidad, entidad_id),
  INDEX idx_auditoria_usuario_fecha (usuario_id, created_at)
) ENGINE=InnoDB;
