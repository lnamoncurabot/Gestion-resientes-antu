# Plan de Trabajo

## Fase 1: Levantamiento

- Recibir y analizar el Excel original. Completado inicialmente en `docs/08-estructura-excel.md`.
- Identificar campos exactos de cada pestana. Completado inicialmente.
- Confirmar roles y permisos. Completado inicialmente con prototipos HTML.
- Recibir maquetas de menus por usuario. Completado con prototipos HTML.
- Confirmar motor de base de datos. Definido: MySQL con MySQL Workbench.

## Fase 2: Diseno funcional

- Definir pantallas por rol.
- Respetar menus, botones y opciones de los prototipos HTML entregados.
- Definir ficha del residente.
- Definir formularios digitales basados en las pestanas.
- Definir reglas condicionales del formulario CAM.
- Definir reportes iniciales.

## Fase 3: Modelo de datos

- Crear modelo relacional.
- Crear migraciones.
- Importar residentes desde Excel.
- Importar usuarios iniciales.
- Definir tablas de auditoria.

## Fase 4: Prototipo local

- Crear backend Node.js.
- Crear frontend web.
- Crear login y permisos.
- Crear CRUD de residentes.
- Crear primer formulario diario.
- Probar ejecucion local.

Alcance recomendado para el primer prototipo:

- Login simulado o real por usuario.
- Menu por rol segun prototipos.
- Listado de residentes desde datos iniciales.
- Ficha resumida de residente.
- Registro CAM completo como primer flujo operativo.
- Vista `Mis registros` para CAM con regla de edicion de 16 horas.

## Fase 5: Formularios clinicos

- Implementar Form CAM.
- Implementar Form DT.
- Implementar Form Enf.
- Implementar Form Nutri.
- Crear historial por residente.

## Fase 6: Reportes y cierre MVP

- Reporte diario por residente.
- Reporte por rango de fechas.
- Exportacion a Excel o PDF.
- Respaldo de base de datos.
- Manual de uso basico.

## Informacion que falta

- Archivo Excel con las pestanas reales.
- Maquetas de menu por usuario.
- Confirmacion de base de datos preferida.
- Confirmacion de si habra acceso desde varios computadores o solo desde uno.
- Reglas de alerta para signos vitales fuera de rango.
