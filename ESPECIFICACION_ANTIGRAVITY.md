# ARQUITECTURA Y ESPECIFICACIÓN TÉCNICA - SISTEMA SIDER (STOCK POR ALMACENES Y SOLICITUDES)

## Archivos incluidos en este paquete:
1. `usuarios_sider.json`: Base de datos procesada con los 1,093 usuarios (Colaboradores, Practicantes y Cese incluyendo a Carlos Ulloa), con `primer_nombre`, `primer_apellido`, `login_corto` (`Primer Nombre + Primer Apellido`), `nombre_completo`, `correo_sugerido`, además del catálogo SAP de 16 materiales y el stock inicial de los 4 almacenes (`PT 08`, `PT 09`, `PT 15 BAHÍA`, `PT15 CURVA`).
2. `sistema_stock_sider.html`: Aplicación web base 100% funcional con los 3 módulos integrados:
   - **Portal Operario (Calculadora Naranja):** Login con autocompletado por Primer Nombre + Primer Apellido o Nombre Completo, creación de contraseña y correo en el primer ingreso, convertidor de medidas con detección automática de Código SAP y panel de notificaciones.
   - **Subdominio / Panel Administrador (`/admin`):** Bandeja de aprobación/rechazo con doble notificación (correo + panel) y editor en vivo de medidas por almacén.
   - **Pantalla TV (`STOCK POR ALMACENES`):** Réplica exacta del monitor naranja para planta/despacho.
