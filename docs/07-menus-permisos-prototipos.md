# Menus y Permisos Segun Prototipos

## Regla principal

Los prototipos HTML entregados son la referencia para definir los botones, opciones de menu y funcionalidades visibles por cada tipo de usuario. La plataforma final debe respetar esta separacion de accesos por rol.

## Prototipos fuente

- Administrador: `Administrador.html`
- Cuidadora adulto mayor: `CAM.html`
- Directora tecnica: `Directora Técnica.html`
- Enfermero: `Enfermero.html`
- Nutricionista: `Nutricionista.html`

## Administrador

Menu principal:

- Dashboard.
- Residentes.
- Base datos residentes.
- Formularios.
- Registros usuarios.
- Alertas / Alarmas.
- Rangos de alerta.
- Usuarios y roles.
- Reportes PDF.
- Power BI.

Acciones y opciones detectadas:

- Buscar residente.
- Aceptar residente.
- Ver ficha.
- Ver registros.
- Editar registros.
- Guardar registros.
- Guardar cambios.
- Cerrar alertas.
- Guardar nuevos rangos de alerta.

Pestanas internas detectadas:

- CAM / Cuidadoras.
- Directora Tecnica.
- Enfermero.
- Nutricionista.

Alcance esperado:

- Puede ver una vision global del sistema.
- Puede administrar residentes.
- Puede administrar usuarios y roles.
- Puede revisar registros de otros usuarios.
- Puede configurar rangos de alerta.
- Puede gestionar alertas y reportes.

## CAM / Cuidadora Adulto Mayor

Menu principal:

- Inicio.
- Registro CAM.
- Mis registros.

Acciones y opciones detectadas:

- Ingresar registro CAM.
- Ver mis registros.
- Buscar residente activo.
- Guardar registro.
- Confirmar guardado.
- Volver y corregir.
- Editar registro propio.
- Ver estado editable o bloqueado.

Secciones del formulario:

- Datos base.
- Residente.
- Control de ciclos.
- Administracion de medicamentos.
- Observaciones.

Reglas especiales:

- El formulario es modular: se habilitan solo las secciones que aplican.
- Los registros pueden editarse solo dentro de una ventana de 16 horas.
- Despues de ese plazo, el registro queda bloqueado para el usuario.
- Solo debe trabajar sobre residentes activos.

## Directora Tecnica

Menu principal:

- Inicio.
- Formulario DT.
- Dashboard residentes.
- Mis registros.

Acciones y opciones detectadas:

- Ingresar evolucion DT.
- Buscar residente.
- Guardar registro.
- Confirmar guardado.
- Volver y corregir.
- Editar registro propio.
- Ver estado editable o bloqueado.

Pestanas del dashboard de residente:

- Evolucion.
- Controles CAM.
- Nutricion.
- Alertas.

Alcance esperado:

- Puede registrar evolucion o comentario tecnico.
- Puede revisar ficha resumida del residente antes de guardar.
- Puede consultar dashboard de residentes.
- Puede revisar controles CAM, nutricion y alertas.
- Sus registros siguen regla de edicion limitada por tiempo.

## Enfermero

Menu principal:

- Inicio.
- Formulario Enfermero.
- Dashboard residentes.
- Mis registros.

Acciones y opciones detectadas:

- Ingresar evolucion Enfermero.
- Buscar residente.
- Guardar registro.
- Confirmar guardado.
- Volver y corregir.
- Editar registro propio.
- Ver estado editable o bloqueado.

Pestanas del dashboard de residente:

- Evolucion.
- Controles CAM.
- Nutricion.
- Alertas.

Alcance esperado:

- Puede registrar evolucion o comentario clinico.
- Puede revisar ficha resumida del residente antes de guardar.
- Puede consultar dashboard de residentes.
- Puede revisar controles CAM, nutricion y alertas.
- Sus registros siguen regla de edicion limitada por tiempo.

## Nutricionista

Menu principal:

- Inicio.
- Registro nutricional.
- Residentes.
- Mis registros.

Acciones y opciones detectadas:

- Ingresar registro nutricional.
- Buscar residente.
- Guardar registro.
- Confirmar guardado.
- Volver y corregir.
- Editar registro propio.
- Ver estado editable o bloqueado.

Campos y bloques detectados:

- Fecha.
- Hora.
- Edad autocompletada.
- Peso inicial autocompletado.
- Sexo autocompletado.
- Estatura.
- IMC.
- Clasificacion CC.
- Clasificacion CB.
- Clasificacion PT.
- Clasificacion CP.
- Observaciones o indicaciones nutricionales.
- Ultimos registros nutricionales del residente.

Reglas especiales:

- El registro nutricional se orienta a control mensual.
- La ficha basica del residente se usa para autocompletar datos.
- Sus registros siguen regla de edicion limitada por tiempo.

## Reglas transversales

- Cada usuario debe ver solo el menu correspondiente a su rol.
- Cada formulario debe exigir seleccion de residente activo.
- Cada guardado debe mostrar confirmacion antes de persistir.
- Cada registro debe guardar usuario, rol, fecha y hora.
- Los registros propios pueden editarse por el usuario creador solo durante 16 horas, salvo permisos superiores del administrador.
- Los registros bloqueados deben mostrarse como no editables.
- La ficha resumida del residente debe mostrarse antes o durante el llenado cuando el prototipo lo indica.
- Las alertas deben usar niveles visuales: normal, alerta y critico.
- El administrador debe poder configurar rangos de alerta y cerrar alertas con comentario.
