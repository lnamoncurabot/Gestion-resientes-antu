# Formularios y Flujos

## Regla comun

Cada formulario debe comenzar seleccionando un residente desde la tabla `Residentes`. No debe permitirse crear registros clinicos sobre personas que no existan en esa base.

## Formulario Direccion Tecnica

Fuente: pestana `Form DT`.

Periodicidad esperada:

- Semanal por residente.

Flujo preliminar:

- Seleccionar residente.
- Seleccionar semana o rango de fechas.
- Completar campos segun estructura del Excel.
- Guardar registro.
- Permitir consultar registros anteriores.

## Formulario Enfermeria

Fuente: pestana `Form Enf`.

Periodicidad esperada:

- Semanal por residente, pendiente de confirmar.

Flujo preliminar:

- Seleccionar residente.
- Registrar controles clinicos o seguimiento de enfermeria.
- Agregar observaciones y acciones requeridas.
- Guardar registro con usuario y fecha.

## Formulario Cuidadoras Adulto Mayor

Fuente: pestana `Form CAM`.

Caracteristica principal:

- Es el formulario mas extenso y debe desplegar secciones segun el tipo de atencion.

Tipos de comportamiento esperados:

- Si solo se toman ciclos, mostrar solo campos de ciclos/signos.
- Si se suministran medicamentos, mostrar bloque de medicamentos.
- Si hay cuidados especiales, mostrar bloque correspondiente.
- Si hay observaciones relevantes, permitir comentario libre.

Flujo preliminar:

- Seleccionar residente.
- Seleccionar tipo de atencion.
- Completar secciones visibles.
- Validar campos obligatorios segun tipo de atencion.
- Guardar registro.

## Formulario Nutricionista

Fuente: pestana `Form Nutri`.

Periodicidad esperada:

- Semanal o mensual, pendiente de confirmar con el Excel.

Flujo preliminar:

- Seleccionar residente.
- Registrar evaluacion nutricional.
- Registrar comentarios de alimentacion, dieta o recomendaciones.
- Guardar historial.

## Ficha del Residente

Vista central por residente:

- Datos personales.
- Datos del apoderado.
- Antecedentes clinicos relevantes.
- Ultimos controles vitales.
- Ultimas bitacoras.
- Formularios profesionales recientes.
- Historial filtrable por fecha y tipo de registro.

