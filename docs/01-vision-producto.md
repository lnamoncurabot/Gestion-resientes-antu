# Plataforma de Gestion de Residentes Antu

## Objetivo

Crear una plataforma web para gestionar la informacion diaria, semanal y mensual de residentes de un centro geriatrico, centralizando datos clinicos basicos, bitacoras de cuidados, controles, tratamientos, nutricion y observaciones profesionales.

## Problema que resuelve

Actualmente la informacion de residentes, controles diarios, formularios profesionales y registros de cuidado puede quedar distribuida en planillas o documentos separados. La plataforma debe permitir que cada usuario registre informacion segun su rol, siempre asociada a un residente existente, y que el equipo pueda consultar el historial completo de forma clara.

## Alcance inicial

- Mantener una base de residentes.
- Mantener usuarios y permisos segun perfil.
- Registrar signos vitales diarios:
  - Presion arterial.
  - Temperatura.
  - Saturacion de oxigeno.
  - Glucosa.
  - Frecuencia cardiaca.
  - Otros controles que defina el centro.
- Registrar bitacoras diarias de cuidado.
- Registrar formularios semanales o mensuales por perfil profesional.
- Consultar historial por residente.
- Mostrar alertas o valores fuera de rango en una etapa posterior.

## Modulos propuestos

- Autenticacion y permisos.
- Residentes.
- Ficha clinica resumida.
- Controles diarios.
- Formulario cuidadoras adulto mayor.
- Formulario enfermeria.
- Formulario direccion tecnica.
- Formulario nutricionista.
- Bitacora y comentarios.
- Reportes e historial.

## Principios de diseno

- La plataforma debe incorporar la identidad visual del Hogar Antu, usando el logo oficial en la cabecera principal.
- Todo registro debe quedar asociado a un residente.
- Todo registro debe guardar usuario creador, fecha y hora.
- Los formularios deben parecerse lo mas posible a las pestanas del Excel original.
- La informacion diaria debe ser rapida de ingresar desde computador o tablet.
- La consulta historica debe priorizar claridad, filtros por fecha y exportacion.

## Identidad visual

- Logo local para maqueta: `mockups/web/assets/antu-logo.png`.
- El logo se muestra en la barra superior de la plataforma junto al nombre del centro.
