# Estructura Detectada del Excel

Archivo analizado:

- `docs/Base Residentes - Formularios Usuarios.xlsx`

Pestanas detectadas:

- Usuarios.
- Residentes.
- Form DT.
- Form Enf.
- Form CAM.
- Nutri.

## Usuarios

Columnas detectadas:

- ID.
- Nombre.
- Usuario.
- Rol.
- Comentario.

Usuarios iniciales detectados:

| Usuario | Email | Rol en Excel | Rol propuesto en sistema |
| --- | --- | --- | --- |
| Marcelo Namoncura Poblete | adminitracion@hogarantu.cl | Administrador | Administrador |
| Luis Namoncura Poblete | administracion_respaldo@hogarantu.cl | Administrador | Administrador |
| Carlos Contreras | enfermero@hogaantu.cl | Supervisor | Enfermero |
| Nutri | nutricion@hogarantu.cl | Usuario | Nutricionista |
| Directora tecnica | dt@hogarantu.cl | Supervisor | Directora tecnica |
| CAM1 | cam-dia@hogarantu.cl | usuario | CAM |
| CAM2 | cam-noche@hogarantu.cl | usuario | CAM |

Observaciones:

- Hay posibles errores de tipeo en emails: `adminitracion@...` y `enfermero@hogaantu.cl`.
- El nombre de directora tecnica aparece como texto enriquecido en el XML de Excel, por eso la lectura automatica lo detecto parcialmente. Debe revisarse visualmente o normalizarse al importar.

## Residentes

Columnas detectadas:

- ID.
- Nombre.
- Rut.
- Fecha Nac.
- Edad (formula).
- Fecha Ingreso.
- Peso Inicial (kg).
- Patologias de Ingreso.
- Apoderado.
- Mail Apoderado.
- Telefono Apoderado.
- Telefono Contacto SOS.
- Nombre Contacto SOS.
- Servicio Urgencia.
- Estado.

Reglas iniciales:

- Esta pestana sera la base maestra de residentes.
- Todo formulario debe seleccionar residentes desde esta tabla.
- Solo residentes con estado `Activo` deben aparecer en los formularios operativos, salvo permisos de administrador.
- Las fechas vienen como numeros seriales de Excel y deben convertirse a fecha real durante la importacion.

Residentes activos detectados:

- El prototipo menciona 15 residentes activos sobre una capacidad total de 18.
- En el Excel se detectaron 15 filas principales con estado activo.

## Form DT

Campos detectados:

- Nombre Residente.
- Rut.
- Fecha Registro.
- Evolucion Clinica.

Uso esperado:

- Formulario de Directora Tecnica.
- Registro asociado a residente.
- Periodicidad esperada: semanal, segun levantamiento inicial.

## Form Enf

Campos detectados:

- Nombre Residente.
- Rut.
- Fecha Registro.
- Evolucion.

Decision funcional:

- El rol se llamara `Enfermero`.
- El formulario se implementara como `Formulario Enfermero`.
- El prototipo fuente corresponde a `Enfermero.html`, aunque internamente use textos TENS en algunos lugares.

## Form CAM

Campos y secciones detectadas:

- Formulario Cuidadores Adulto Mayor.
- Control de Ciclos.
- Nombre CAM.
- Hora.
- Fecha.
- Residente.
- Edad.
- Temperatura en grados Celsius.
- Saturacion.
- Presion arterial.
- HGT / glucosa.
- Administracion de Medicamentos: SI/NO.
- Horario y nombre de medicamento si corresponde.
- Observaciones.
- Ejemplos de observaciones: cambios conductuales, orina de mal olor, salidas, accidentes o urgencias medicas.

Reglas iniciales:

- Debe ser un formulario modular.
- El usuario habilita solo las secciones que aplica.
- Puede registrar control de ciclos, medicamentos, observaciones o una combinacion.
- Debe guardar turno, cuidadora, fecha, hora y residente.
- En la maqueta, las graficas de control de ciclos muestran los ultimos 5 dias con 3 lecturas por dia.
- Las graficas usan limites superior e inferior para las variables clinicas.
- El peso no se considera lectura de ciclo diaria. Se registra al ingreso y luego como control mensual, junto a indicacion de minuta o regimen.

Umbrales usados actualmente en maqueta:

| Variable | Limite inferior | Limite superior | Unidad |
| --- | ---: | ---: | --- |
| Temperatura | 36.0 | 37.5 | C |
| Saturacion SpO2 | 95 | 100 | % |
| Presion diastolica | 60 | 89 | mmHg |
| HGT / Glucosa | 70 | 180 | mg/dL |
| Peso | No aplica a ciclo diario | No aplica a ciclo diario | kg |

Pendiente:

- Confirmar si estos umbrales son los definitivos o si el centro usara otros rangos.

## Nutri

Campos detectados:

- Nombre Residente.
- Sexo.
- Edad.
- Peso.
- Talla.
- IMC.
- Clasificacion de IMC.
- CC.
- Clasificacion CC.
- CB.
- Clasificacion CB.
- PT.
- Clasificacion PT.
- CP.
- Clasificacion CP.
- Observaciones/recomendaciones.

Uso esperado:

- Formulario de Nutricionista.
- Registro mensual o segun frecuencia definida por el centro.
- Debe autocompletar datos base del residente cuando corresponda.

## Decisiones tecnicas derivadas

- Base de datos: MySQL.
- Herramienta de administracion local: MySQL Workbench.
- Backend propuesto: Node.js con TypeScript.
- Frontend propuesto: React con TypeScript.
- ORM propuesto: Prisma con proveedor MySQL.

## Pendientes antes de importar datos

- Confirmar correccion de emails con posible error de tipeo.
- Definir si se importaran usuarios con contrasena inicial generica o si el administrador las creara manualmente.
- Confirmar si los residentes inactivos o cupos vacios se cargaran desde el inicio.
- Confirmar si se debe conservar el RUT exactamente como texto, incluyendo puntos y guion.
