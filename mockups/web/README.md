# Maqueta Web Local

Esta maqueta no requiere Node.js, MySQL ni MySQL Workbench.

## Opcion rapida

Abrir directamente:

```text
mockups/web/index.html
```

## Opcion con servidor local

Desde PowerShell, ejecutar:

```powershell
cd "C:\Users\luis namoncura\Documents\Gestión Residentes Antú\mockups\web"
powershell -NoProfile -ExecutionPolicy Bypass -File .\serve.ps1 -Port 4175
```

Luego abrir:

```text
http://localhost:4175
```

## Que revisar

- Confirmar que el logo del Hogar Antu aparezca en la barra superior.
- Cambiar la vista de usuario desde el selector superior.
- Confirmar que cada rol tenga su menu correcto.
- Revisar ficha de residente.
- Probar Registro CAM.
- Habilitar secciones CAM: ciclos, medicamentos y observaciones.
- Guardar un registro CAM y revisar `Mis registros`.
- Revisar formularios de Directora Tecnica, Enfermero y Nutricionista.
- Revisar panel administrador: residentes, alertas, rangos, usuarios, reportes y Power BI.

## Nota

La maqueta usa datos de ejemplo tomados del Excel y de los prototipos. Todavia no guarda en base de datos; eso corresponde a la siguiente etapa tecnica.

## Activos visuales

- Logo: `assets/antu-logo.png`.
