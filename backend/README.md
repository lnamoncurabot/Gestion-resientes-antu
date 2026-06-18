# Backend Node.js

Primer esqueleto del API para conectar la maqueta con MySQL.

## Preparacion

1. Crear la base ejecutando los SQL de `../database` en MySQL Workbench.
2. Copiar `.env.example` como `.env`.
3. Ajustar usuario y clave de MySQL.
4. Instalar dependencias:

```bash
npm install
```

5. Ejecutar en desarrollo:

```bash
npm run dev
```

API local esperada:

```text
http://localhost:3001/api
```

## Endpoints iniciales

- `GET /api/health`
- `GET /api/residentes?search=texto`
- `GET /api/residentes/:id/dashboard`

Los endpoints de escritura de formularios CAM, DT, Enfermero y Nutricionista son el siguiente paso.
