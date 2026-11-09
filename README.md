# Sistema de Solicitudes y Stock por Almacenes - SIDERPERU

Plataforma web empresarial para la gestión, cálculo, solicitud y control del stock de barras y varillas de acero corrugado en los almacenes de producto terminado de **SIDERPERU**.

Diseñado y optimizado para despliegue directo en **Vercel** o ejecución local como SPA (Single Page Application) sin dependencias externas obligatorias.

---

## 🚀 Despliegue en Vercel

El proyecto está 100% configurado para Vercel:
1. Conecta este repositorio en tu panel de [Vercel](https://vercel.com).
2. Framework Preset: **Other** (sitio estático / HTML).
3. Root Directory: `./` (raíz).
4. Haz clic en **Deploy**. ¡Listo en segundos!

El archivo [`vercel.json`](./vercel.json) gestiona automáticamente las rutas limpias:
- **`https://tu-proyecto.vercel.app/`** ➔ Portal del Operario (Calculadora / Convertidor SAP)
- **`https://tu-proyecto.vercel.app/admin`** ➔ Panel de Control Administrativo (Módulo Privado / Oculto)
- **`https://tu-proyecto.vercel.app/api/usuarios`** ➔ API REST con los 1,093 usuarios precargados
- **`https://tu-proyecto.vercel.app/api/solicitudes`** ➔ API REST / Serverless de Sincronización en la Nube Multi-PC

---

## 🌐 Sincronización en la Nube en Tiempo Real (Multi-Dispositivo)

El sistema cuenta con un **Motor de Sincronización Central en la Nube**:
- **Multi-PC en Vivo:** Un operario envía una solicitud desde su laptop o celular y el Administrador en otra computadora la recibe automáticamente en pantalla en segundos (sin recargar la página).
- **Resolución Bidireccional:** Al aprobar o rechazar una solicitud desde el panel `/admin`, el operario ve cambiar su estado (*Pendiente* ➔ *Aprobado*) en su pantalla de inmediato.
- **Doble Capa de Redundancia:** Almacenamiento local inmediato (`localStorage`) + Endpoint `/api/solicitudes` + Base de Datos Central en la Nube.

---

## 📦 Módulos del Sistema (100% Enfocado en Operario y Administrador)

### 1. Portal del Operario (Interfaz Ágil y Dinámica)
- **Acceso Inteligente:** Búsqueda y autocompletado en tiempo real con 1,093 colaboradores y practicantes desde la base de datos oficial.
- **Configuración Rápida de Primer Ingreso:** Define su contraseña o PIN personal en 2 segundos (sin correos ni trámites complejos).
- **Consola Digital de Despacho (Calculadora SAP):**
  - Selector táctil de **Diámetro** (`6mm`, `8mm`, `1/2"`, `3/8"`, `5/8"`, `12mm`, `3/4"`, `1"`).
  - Selector de **Tipo / Procedencia** (`Nacional`, `Importado`, `Fecoxi`, `FM`) con asignación automática del **Código SAP**.
  - Selector de **Largo** (`9m`, `12m`, `3m`, `Solo Diámetro`).
  - Selector de **Almacén Objetivo** (`PT 08`, `PT 09`, `PT 15 BAHÍA`, `PT15 CURVA`).
  - Selector de **Cantidad** con botones rápidos de ajuste `[-10] [-1] [+1] [+10]`.
  - Indicador dinámico de stock disponible en el almacén seleccionado.
  - **Envío con 1 Clic:** Registra la solicitud y la transmite instantáneamente a la nube.
- **Bandeja de Mis Solicitudes:**
  - Historial en vivo del estado de sus pedidos con badges dinámicos de color (*Pendiente*, *Aprobado*, *Rechazado*).
  - Instrucciones de despacho autorizadas por la administración.

### 2. Panel Administrativo Privado (`/admin`)
- **Acceso Oculto:** Módulo protegido sin accesos públicos en la navegación principal. Se ingresa mediante la ruta `/admin` o `#admin` con credenciales maestras (`admin` / `sider2026`).
- **Navegación por Pestañas:**
  - **Bandeja de Solicitudes en Tiempo Real:**
    - Métricas clave en tiempo real (KPIs): Total de Solicitudes, Pendientes, Aprobadas y Rechazadas.
    - Filtros por estado y buscador en vivo por operario o código SAP.
    - **Aprobar:** Confirma o reasigna el almacén de despacho y redacta notas operativas para el transporte.
    - **Rechazar:** Registra el motivo oficial de rechazo o falta de stock.
    - **Sincronizar Nube:** Botón para forzar actualización instantánea.
    - **Exportar CSV:** Descarga un reporte completo en Excel/CSV de todas las solicitudes históricas.
  - **Materiales y Tipos SAP (Catálogo Maestro):**
    - Administrador completo de materiales: registra nuevos Códigos SAP, medidas/diámetros y calidades de acero.
    - Gestión de Tipos y Procedencias (`Nacional`, `Importado`, `Fecoxi`, `FM`, `ASTM A706`, `ASTM A615`, etc.).
    - Edición, pausa temporal (Activo / Inactivo) y eliminación de materiales.
  - **Medidas por Almacén:**
    - Añadir o retirar medidas activas en los 4 almacenes (`PT 08`, `PT 09`, `PT 15 BAHÍA`, `PT15 CURVA`).

---

## 📋 Catálogo Maestro de Materiales SAP

| Código SAP | Descripción (Diámetro) | Tipo | Estado |
| :--- | :--- | :--- | :--- |
| `110000255` | `6mm` | Importado | ACTIVO |
| `110000265` | `8mm` | Importado | ACTIVO |
| `110007205` | `8mm` | Fecoxi | ACTIVO |
| `110000276` | `1/2"` | Nacional | ACTIVO |
| `110000263` | `1/2"` | Importado | ACTIVO |
| `110007204` | `1/2"` | Fecoxi | ACTIVO |
| `110000266` | `3/8"` | Importado | ACTIVO |
| `110000521` | `3/8"` | Fecoxi | ACTIVO |
| `110000274` | `3/8"` | Nacional | ACTIVO |
| `110000277` | `5/8"` | Nacional | ACTIVO |
| `110000284` | `5/8"` | FM | ACTIVO |
| `110300507` | `5/8"` | Importado | ACTIVO |
| `110000257` | `12mm` | Nacional | ACTIVO |
| `110300623` | `12mm` | Fecoxi | ACTIVO |
| `110000287` | `3/4"` | Nacional | ACTIVO |
| `110000286` | `1"` | Nacional | ACTIVO |

---

## 🏭 Almacenes y Stock Base

- **PT 08:** `6mm`, `8mm`, `1/2 x 9m`, `3/8 x 9m`, `5/8 x 9m`
- **PT 09:** `3/8 x 12m`, `12 mm`, `5/8 x 12 m`, `3/4 x 9m`
- **PT 15 BAHÍA:** `5/8 x 9 m`, `6mm`, `3/8 x 9m`, `1/2 x 9 m`, `6mm`
- **PT15 CURVA:** `1"`, `8 mm`, `12 mm`, `3/4x 12m`

---

## 👥 Base de Datos de Usuarios

Se han procesado y cargado **1,093 registros** desde el archivo oficial de dotación de personal:
- **863** Colaboradores Activos
- **93** Practicantes FLJ
- **137** Registros Históricos / Cese (incluyendo a `Carlos Ulloa` - *Ulloa Villanueva Carlos Jesus*, ID SAP `99353481`)

---

## 💻 Ejecución Local

### Opción A (Sin servidor / Doble Clic)
Haz doble clic en [`iniciar_sistema.bat`](./iniciar_sistema.bat) o abre directamente [`index.html`](./index.html) en cualquier navegador.

### Opción B (Servidor Local Node.js)
```bash
npm start
# O bien:
node server.js
```
Acceso:
- Portal Operario: `http://localhost:3000/`
- Panel Admin: `http://localhost:3000/admin`
- API Usuarios: `http://localhost:3000/api/usuarios`
