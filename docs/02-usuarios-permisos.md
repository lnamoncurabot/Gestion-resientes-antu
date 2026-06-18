# Usuarios y Permisos

## Fuente inicial

La pestana `Usuarios` del Excel sera la referencia para definir los tipos de usuario que entraran a la plataforma y los permisos de cada uno.

## Roles preliminares

| Rol | Descripcion | Permisos iniciales |
| --- | --- | --- |
| Administrador | Gestion general del sistema | Crear usuarios, editar residentes, ver todo, configurar formularios |
| Direccion tecnica | Responsable tecnica del centro | Ver residentes, completar formulario DT, revisar registros clinicos |
| Enfermero | Registro y seguimiento clinico | Registrar evolucion, completar formulario Enfermero, revisar tratamientos y dashboard |
| Cuidadora adulto mayor | Registro operativo diario | Completar formulario CAM, registrar ciclos, cuidados, medicamentos indicados |
| Nutricionista | Seguimiento nutricional | Completar formulario nutricional, comentar alimentacion y estado nutricional |
| Consulta / lectura | Acceso limitado | Ver fichas e historial segun permisos |

## Reglas base

- Cada usuario debe iniciar sesion con credenciales propias.
- Los permisos deben controlar que modulos puede ver y editar cada rol.
- Cada accion relevante debe quedar registrada con fecha, hora y usuario.
- Un usuario puede tener mas de un rol si el centro lo requiere.
- Los menus, botones y opciones visibles por rol deben respetar los prototipos HTML entregados. Ver `docs/07-menus-permisos-prototipos.md`.
- Los registros propios de perfiles operativos/profesionales tienen una ventana de edicion de 16 horas, segun los prototipos. Luego quedan bloqueados para ese usuario.

## Pendientes por validar con Excel

- Lista exacta de usuarios.
- Roles reales usados por el centro.
- Permisos por modulo.
- Si existen usuarios externos, como apoderados o medicos externos.
- Si algunos usuarios solo deben ver residentes especificos.
- Corregir emails con posibles errores de tipeo antes de crear usuarios reales.
