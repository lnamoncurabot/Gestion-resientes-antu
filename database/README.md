# Base de datos MySQL

Esta carpeta contiene el primer paquete SQL para crear la base local del proyecto Gestion Residentes Antu.

## Orden de ejecucion en MySQL Workbench

1. Abrir `01_schema.sql` y ejecutar todo el archivo.
2. Abrir `02_seed.sql` y ejecutar todo el archivo.
3. Abrir `03_views_queries.sql` y ejecutar todo el archivo.
4. Opcional para pruebas completas: abrir `04_seed_demo_30_dias.sql` y ejecutar todo el archivo.

Base creada:

```sql
gestion_residentes_antu
```

## Que incluye

- Roles y usuarios iniciales.
- Residente maestro con 15 residentes activos.
- Apoderado y contacto SOS por residente.
- Umbrales de control de ciclos.
- Tablas para registros CAM, controles de ciclos, medicamentos, registros profesionales, nutricion, peso mensual, alertas y auditoria.
- Vistas para dashboard y bitacora.
- Data demo de 30 dias para probar dashboards por residente y rol.

## Decisiones tecnicas

- MySQL 8 con `utf8mb4`.
- Formularios profesionales y nutricionales permiten `datos_json` para conservar flexibilidad mientras el formulario definitivo se estabiliza.
- Los controles de ciclos y medicamentos quedan normalizados porque alimentan graficas, alertas y bitacoras.
- La ventana de edicion inicial es de 16 horas, segun la maqueta aprobada.

## Pendientes antes de usar con datos reales

- Definir contrasenas iniciales o flujo de cambio de contrasena.
- Confirmar correccion final de correos del Excel.
- Confirmar umbrales clinicos definitivos.
- Confirmar si el RUT se mantendra siempre como texto con puntos y guion.
