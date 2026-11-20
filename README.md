# Sistema de Presupuestos · Vitra House y Muebles Zacapa · v12.8.0

Aplicación web (GitHub Pages + Supabase) de **Representaciones e Inversiones Tinoco S. de R. L.**
Funciona en computadora y celular, también sin internet (se sincroniza al volver la conexión).

## Módulos
- **Cotización Vitra House** (vidriería), **Presupuesto Muebles Zacapa** y **Cálculo de materiales PVC**.
- **Historial de cotizaciones**: etapa automática (borrador → enviada → aceptada → venta → facturada → cobrada → entregada), botón con el siguiente paso y menú con todas las acciones. Guardado en la nube, con papelera.
- **Solicitudes del catálogo**: llegan del enlace público del catálogo.
- **Catálogo de clientes** (administrador).
- **📅 Agenda de citas**: mediciones, visitas, instalaciones y entregas en vista de día, semana, mes o lista; aviso de choque de horario; recordatorio dentro del programa (notificación), archivo de calendario con alarma para el celular, Google Calendar y recordatorio al cliente por WhatsApp.
- **💼 Mis negocios** (administrador): ingresos, gastos y utilidad de todos los negocios, con categorías propias, reportes (estado de resultados mes a mes, comparativo, gastos por categoría) en Excel y PDF. Vitra House y Muebles Zacapa pueden tomar sus datos del Control comercial (automático) o registrarse a mano.
- **Envío**: WhatsApp, correo, **PDF** y **enlace de aceptación con firma** del cliente (`firma.html`).
- **📊 Control comercial**:
  - Resumen, con indicadores por vendedor.
  - **Seguimiento** de cotizaciones.
  - Ventas y cobros, y **Por cobrar** (antigüedad de saldos).
  - Gastos por proyecto.
  - Órdenes de compra, compras e inventario (kárdex), proveedores.
  - Facturación SAR con talonario de imprenta, y **modo autoimpresor** (factura completa impresa, original y copia) que el administrador activa cuando SAR lo autorice.
  - **Comprobante de venta** sin CAI (numeración CV propia): detalle, pagos y saldo, para imprimir o enviar en PDF.
  - **🛡 Auditoría** de cambios.
  - **Acta de entrega** con fotos de la obra y firma del cliente.

## Contenido
```
index.html            programa completo
firma.html            página pública donde el cliente revisa y firma (cotización o acta de entrega)
sw.js                 funcionamiento sin internet (cambie CACHE_VERSION en cada versión)
manifest.webmanifest  instalación como app
assets/               íconos y logos (los logos los usa firma.html)
supabase/             scripts de la base de datos y LEEME.txt con la instalación paso a paso
```

## Instalación de la base de datos (Supabase ▸ SQL Editor), en este orden
1. `supabase_sistema_completo.sql`
2. `supabase_control_comercial.sql`
3. `supabase_firma_cotizaciones.sql`
4. `supabase_auditoria.sql`
5. `supabase_mejoras_v12_3.sql`
6. `supabase_mejoras_v12_4.sql` (costo presupuestado de cada venta)
7. `supabase_mejoras_v12_6.sql` (comprobante de venta y modo autoimpresor)
8. `supabase_mejoras_v12_7.sql` (Mis negocios)
9. `supabase_mejoras_v12_8.sql` (Agenda de citas)

Todos se pueden volver a ejecutar sin perder datos. Los detalles (usuarios, roles, catálogo) están en `supabase/LEEME.txt`.

## Usuarios
Las cuentas viven en **Supabase ▸ Authentication ▸ Users** y las crea el dueño:
`ventasallsupplierhn@gmail.com` (admin) y `ventasallsupplierhn+ventas1@…`, `+ventas2`, `+taller` (operadores).
El rol y el nombre se cambian en **Table Editor ▸ perfiles**. El programa nunca guarda contraseñas en el código.

## Publicar una versión
1. Subir `index.html`, `firma.html`, `sw.js`, `manifest.webmanifest` y `assets/` al repositorio.
2. Si hay scripts SQL nuevos, ejecutarlos antes.
3. Al abrir, el programa avisa que hay una versión nueva.

## Pruebas automáticas
La carpeta de pruebas (entregada aparte) simula Supabase sobre un PostgreSQL local y prueba el programa en un navegador real. Vea su `LEEME.txt`.
No hace falta subirla al repositorio.
