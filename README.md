# Gestion Residentes Antu

Proyecto para construir una plataforma web local de gestion de residentes de un centro geriatrico.

La documentacion inicial esta en la carpeta [docs](docs).

## Estado actual

Base documental inicial creada y maqueta HTML aprobada para los flujos principales.

Componentes disponibles:

- `docs`: documentacion funcional y tecnica.
- `mockups/web`: maqueta HTML/CSS/JS revisable localmente.
- `database`: scripts MySQL para crear estructura, datos iniciales y vistas.
- `backend`: esqueleto inicial Node.js + Express + MySQL.

## Orden sugerido para continuar

1. Ejecutar scripts SQL de `database` en MySQL Workbench.
2. Copiar `backend/.env.example` como `backend/.env` y ajustar credenciales.
3. Instalar dependencias del backend con `npm install`.
4. Ejecutar API con `npm run dev`.
5. Conectar la maqueta o futuro frontend real al API.
