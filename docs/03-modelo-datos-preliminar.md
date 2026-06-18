# Modelo de Datos Preliminar

## Base de datos definida

El proyecto trabajara localmente con:

- MySQL 8, administrado con MySQL Workbench.

La estructura conceptual se disenara para MySQL desde el inicio. Se recomienda usar Prisma como ORM para mantener migraciones versionadas y facilitar la evolucion del modelo.

## Entidades principales

### usuarios

Guarda las cuentas de acceso a la plataforma.

Campos sugeridos:

- id
- nombre
- email
- password_hash
- activo
- fecha_creacion
- fecha_actualizacion

### roles

Define perfiles de permisos.

Campos sugeridos:

- id
- nombre
- descripcion

### usuario_roles

Relaciona usuarios con uno o mas roles.

Campos sugeridos:

- usuario_id
- rol_id

### residentes

Base principal del sistema. Todo formulario o control debe vincularse a un residente.

Campos sugeridos:

- id
- nombres
- apellidos
- rut
- fecha_nacimiento
- sexo
- fecha_ingreso
- estado
- habitacion
- diagnosticos_relevantes
- alergias
- observaciones_generales

### apoderados

Informacion de contacto asociada a cada residente.

Campos sugeridos:

- id
- residente_id
- nombre
- parentesco
- telefono
- email
- direccion
- es_contacto_principal

### controles_vitales

Registro diario o por evento de variables medicas basicas.

Campos sugeridos:

- id
- residente_id
- usuario_id
- fecha_hora
- presion_sistolica
- presion_diastolica
- temperatura
- saturacion_oxigeno
- glucosa
- frecuencia_cardiaca
- frecuencia_respiratoria
- observaciones

### bitacoras_diarias

Registro general de eventos, cuidados y observaciones del dia.

Campos sugeridos:

- id
- residente_id
- usuario_id
- fecha_hora
- tipo_evento
- descripcion
- requiere_seguimiento

### formulario_dt

Registro semanal de direccion tecnica.

Campos sugeridos:

- id
- residente_id
- usuario_id
- semana_inicio
- semana_fin
- datos_json
- observaciones
- fecha_creacion

### formulario_enfermero

Registro semanal o segun periodicidad definida por el rol Enfermero.

Campos sugeridos:

- id
- residente_id
- usuario_id
- periodo_inicio
- periodo_fin
- datos_json
- observaciones
- fecha_creacion

### formulario_cam

Registro de cuidadoras adulto mayor. Debe admitir secciones condicionales segun tipo de atencion.

Campos sugeridos:

- id
- residente_id
- usuario_id
- fecha_hora
- tipo_atencion
- datos_json
- observaciones
- fecha_creacion

### formulario_nutricionista

Registro de nutricion.

Campos sugeridos:

- id
- residente_id
- usuario_id
- periodo
- datos_json
- comentarios
- fecha_creacion

## Nota tecnica sobre formularios

Para la primera version conviene guardar formularios extensos en tablas por formulario con un campo `datos_json`, porque las pestanas del Excel probablemente tengan muchas preguntas y condiciones. Cuando el formulario se estabilice, se pueden normalizar campos criticos para reportes.
