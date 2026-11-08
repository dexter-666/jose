# Sistema de Solicitudes y Stock por Almacenes - SIDERPERU

Aplicación web integral para la gestión, cálculo, solicitud y monitoreo en tiempo real del stock de barras y varillas de acero corrugado en los almacenes de producto terminado de **SIDERPERU**.

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
- **`https://tu-proyecto.vercel.app/admin`** ➔ Panel de Administración y Aprobaciones
- **`https://tu-proyecto.vercel.app/pantalla-stock`** ➔ Monitor TV para Despacho y Planta
- **`https://tu-proyecto.vercel.app/api/usuarios`** ➔ API REST con los 1,093 usuarios precargados

---

## 📦 Módulos del Sistema

### 1. Portal Operario (Calculadora Industrial Naranja)
- **Acceso Inteligente:** Búsqueda y autocompletado en tiempo real con 1,093 colaboradores y practicantes desde la base de datos oficial.
- **Configuración de Primer Ingreso:** Si el usuario entra por primera vez, registra su correo para notificaciones y crea su contraseña (con confirmación de seguridad).
- **Calculadora / Convertidor SAP:**
  - Selector táctil por chips de **Diámetro** (`6mm`, `8mm`, `1/2"`, `3/8"`, `5/8"`, `12mm`, `3/4"`, `1"`).
  - Selector de **Tipo / Procedencia** (`Nacional`, `Importado`, `Fecoxi`, `FM`) con asignación automática del **Código SAP**.
  - Selector de **Largo** (`9m`, `12m`, `3m`, `Estándar`) y selector numérico de cantidad.
  - Indicador dinámico de stock disponible en el almacén seleccionado (`PT 08`, `PT 09`, `PT 15 BAHÍA`, `PT15 CURVA`).
- **Bandeja de Mis Notificaciones:** Historial en vivo del estado de sus pedidos con badges de color (*Pendiente*, *Aprobado*, *Rechazado*) y notas del administrador.

### 2. Panel Administrador (`/admin`)
- **Acceso Seguro:** Credenciales maestras (`admin` / `sider2026`).
- **Bandeja de Solicitudes Entrantes:**
  - Filtros rápidos por estado: *Todas*, *Pendientes*, *Aprobadas*, *Rechazadas*.
  - **Aprobar:** Permite confirmar o reasignar el almacén de despacho y redactar una nota de transporte.
  - **Rechazar:** Permite registrar el motivo de falta de stock.
  - **Exportar CSV:** Descarga un reporte completo en Excel/CSV de todas las solicitudes históricas.
  - **Doble Notificación:** Dispara la notificación al panel del operario y confirma el envío de correo automático.
- **Editor en Vivo del Tablero TV:** Añade o retira medidas activas por almacén con actualización inmediata.

### 3. Pantalla TV en Vivo (`/pantalla-stock`)
- **Estética Industrial:** Réplica exacta del tablero naranja "STOCK POR ALMACENES" para proyectar en televisores de planta.
- **Sincronización en Tiempo Real:** Actualizaciones instantáneas vía eventos de almacenamiento entre pestañas y dispositivos.
- **Reloj Digital y Modo Pantalla Completa:** Botón **⛶ Pantalla Completa** y reloj en vivo para monitores desatendidos.

---

## 📋 Catálogo Maestro de Materiales SAP

| Código SAP | Descripción (Diámetro) | Tipo |
| :--- | :--- | :--- |
| `110000255` | `6mm` | Importado |
| `110000265` | `8mm` | Importado |
| `110007205` | `8mm` | Fecoxi |
| `110000276` | `1/2"` | Nacional |
| `110000263` | `1/2"` | Importado |
| `110007204` | `1/2"` | Fecoxi |
| `110000266` | `3/8"` | Importado |
| `110000521` | `3/8"` | Fecoxi |
| `110000274` | `3/8"` | Nacional |
| `110000277` | `5/8"` | Nacional |
| `110000284` | `5/8"` | FM |
| `110300507` | `5/8"` | Importado |
| `110000257` | `12mm` | Nacional |
| `110300623` | `12mm` | Fecoxi |
| `110000287` | `3/4"` | Nacional |
| `110000286` | `1"` | Nacional |

---

## 🏭 Configuración de Almacenes y Stock Inicial

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
Abre en tu navegador:
- Operario: `http://localhost:3000/`
- Administrador: `http://localhost:3000/admin`
- Pantalla TV: `http://localhost:3000/pantalla-stock`

---

## 🔐 Credenciales de Demostración

- **Administrador:** Usuario `admin` \| Contraseña `sider2026`
- **Operario de prueba:** Escribe `Carlos Ulloa` en el buscador, selecciónalo, define tu contraseña y correo de prueba.

