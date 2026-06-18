# Arquitectura Local Propuesta

## Objetivo tecnico

Construir una plataforma web que pueda ejecutarse localmente en el PC, usando Node.js para backend y una base de datos relacional local.

## Stack recomendado

Frontend:

- React.
- Vite.
- TypeScript.

Backend:

- Node.js.
- Express o NestJS.
- TypeScript.

Base de datos:

- MySQL 8, administrado con MySQL Workbench.

ORM sugerido:

- Prisma con proveedor MySQL.

Autenticacion:

- Login con email y contrasena.
- Hash de contrasenas con bcrypt.
- Sesiones o JWT, segun se defina el despliegue local.

## Estructura sugerida del repositorio

```text
/
  docs/
  apps/
    web/
    api/
  packages/
    database/
```

Alternativa simple para primera version:

```text
/
  src/
    client/
    server/
  prisma/
  docs/
```

## Pantallas iniciales

- Login.
- Menu principal segun rol.
- Listado de residentes.
- Ficha del residente.
- Registro de control diario.
- Formulario CAM.
- Formulario DT.
- Formulario enfermeria.
- Formulario nutricionista.
- Historial y reportes.

## Consideraciones de seguridad

- No guardar contrasenas en texto plano.
- Restringir acceso por rol.
- Registrar auditoria de creacion y edicion.
- Hacer respaldos periodicos de la base de datos.
- Definir politica para datos sensibles de salud.

## Ejecucion local esperada

Comandos objetivo cuando exista la aplicacion:

```bash
npm install
npm run db:migrate
npm run dev
```

Luego se abriria la plataforma en:

```text
http://localhost:3000
```

## Nota de entorno

En la terminal actual aun no se detecta `node` en el PATH. Antes de iniciar el prototipo tecnico se debe instalar Node.js o ajustar el PATH si ya esta instalado.
