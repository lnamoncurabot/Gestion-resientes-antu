# Diseno Base de Datos MySQL

## Objetivo

Crear la primera estructura persistente para pasar desde maqueta HTML a una aplicacion real con backend Node.js y MySQL.

## Archivos SQL generados

- `database/01_schema.sql`: crea base, tablas, llaves, indices y relaciones.
- `database/02_seed.sql`: carga roles, usuarios, umbrales, residentes, apoderados y pesos de ingreso.
- `database/03_views_queries.sql`: crea vistas y deja consultas base para dashboard, busqueda, bitacora, ciclos, medicamentos y peso mensual.
- `database/04_seed_demo_30_dias.sql`: genera data ficticia de 30 dias para los 15 residentes y todos los roles operativos.

## Entidades principales

- `roles`
- `usuarios`
- `usuario_roles`
- `residentes`
- `apoderados`
- `umbrales_ciclos`
- `registros_cam`
- `controles_ciclos`
- `administraciones_medicamentos`
- `registros_profesionales`
- `registros_nutricion`
- `controles_peso`
- `alertas`
- `auditoria_eventos`

## Reglas funcionales reflejadas

- Todo registro clinico se asocia a un residente existente.
- CAM debe guardar cuidadora, fecha, hora, residente, turno y tipo de registro.
- Control de ciclos queda separado para graficas y alertas.
- Medicamentos quedan separados para consultar fecha, remedio y cuidadora que suministro.
- Directora Tecnica y Enfermero comparten tabla profesional con rol discriminador.
- Nutricionista tiene tabla propia porque maneja peso, talla, IMC, regimen y observaciones.
- Peso inicial se carga desde residente y luego se controla mensualmente.
- Alertas se pueden abrir y cerrar con comentario.
- Auditoria permite registrar acciones importantes por usuario.

## Vistas y consultas clave

- `v_residentes_activos`: ficha resumida de residentes activos con apoderado.
- `v_controles_ciclos`: controles listos para graficas.
- `v_control_medicamentos`: medicamentos suministrados por residente.
- `v_bitacora_resumen`: union de CAM, profesionales y nutricionista.

## Siguiente paso tecnico

Crear backend Node.js con:

- Configuracion de conexion MySQL.
- Endpoints para login y usuario actual.
- Endpoints para residentes y busqueda predictiva.
- Endpoints para dashboard por residente.
- Endpoints para guardar formularios CAM, DT, Enfermero y Nutricionista.
