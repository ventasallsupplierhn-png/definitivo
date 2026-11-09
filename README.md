# Sistema de Presupuestos v11.0.0

> **Desde la v11 el servidor es Supabase** (ya no Google Sheets). Los proyectos,
> precios, configuración, el catálogo de clientes y las solicitudes que llegan desde
> el enlace del catálogo se guardan en la nube del dueño. La carpeta `apps-script/`
> queda solo como referencia de la versión anterior.
>
> **Instalación:** vea `supabase/LEEME.txt`.
>
> **Módulos nuevos:** 📥 *Solicitudes del catálogo* (todo el personal) y
> 🛋 *Catálogo de clientes* (administrador). En *Materiales PVC* se puede guardar el
> proyecto y abrirlo desde *Proyectos* con el botón 🪟 Materiales.


Aplicación web con tres módulos de trabajo unidos: **cotización de vidriería
(Vitra House)**, **cálculo de materiales de PVC** y **presupuesto de muebles
(Muebles Zacapa)**, con acceso por contraseña y cuatro usuarios.
Funciona en computadora y celular, **sin conexión**, y opcionalmente sincroniza
con Google Sheets a través de Google Apps Script.

---

## 1. Contenido del paquete

```
/
├── index.html                 ← la aplicación
├── manifest.webmanifest       ← permite instalarla en el celular
├── sw.js                      ← hace que abra sin internet
├── .nojekyll                  ← necesario para GitHub Pages
├── assets/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
├── apps-script/
│   └── Codigo.gs              ← servidor (se pega en Google Apps Script)
└── README.md
```

> Los archivos deben conservar esta estructura de carpetas. Si mueve `assets/`
> el logo dejará de aparecer.

---

## 1b. Acceso, usuarios y roles

Al abrir, la aplicación pide usuario y contraseña. Los cuatro usuarios se definen
en el bloque `AJUSTES_FABRICA` de `index.html`:

```js
usuarios: [
  { usuario:"admin",   pin:"1234", nombre:"Administrador", rol:"admin"    },
  { usuario:"ventas1", pin:"1111", nombre:"Ventas 1",      rol:"operador" },
  { usuario:"ventas2", pin:"2222", nombre:"Ventas 2",      rol:"operador" },
  { usuario:"taller",  pin:"3333", nombre:"Taller",        rol:"operador" }
]
```

| | Administrador | Operador (3 usuarios) |
|---|---|---|
| Crear y editar cotizaciones | Sí | Sí |
| Calcular materiales de PVC | Sí | Sí |
| Imprimir / PDF / Excel | Sí | Sí |
| Enviar por WhatsApp o correo | Sí | Sí |
| Pestaña Administración | Sí | **No** |
| Ver precios y costos de materiales | Sí | Sí |
| Editar precios del catálogo | Sí | **No** |
| Configuración de empresa y servidor | Sí | **No** |
| Eliminar proyectos | Sí | **No** |

Cambie las contraseñas antes de publicar. Si usa servidor, las contraseñas reales
son las de la hoja **USUARIOS**; la lista del archivo funciona como respaldo
cuando no hay internet.

> El repositorio de GitHub Pages es público: quien revise el código puede leer las
> contraseñas del archivo. Sirven para separar funciones entre el personal, no
> como seguridad frente a terceros. La restricción firme es la del servidor.

## 1c. Módulos

La pantalla de acceso y el encabezado de la aplicación llevan el logo
corporativo de Representaciones e Inversiones Tinoco (constante `LOGO_PORTADA`).
Cada documento impreso lleva dos logos a la izquierda: el de su negocio
(`LOGO` para Vitra House, `LOGO_MZ` para Muebles Zacapa) y, a la par, el
corporativo separado por una línea. Los dos encabezan con la razón social
**Representaciones e Inversiones Tinoco S. de R. L.** (constante `RAZON_SOCIAL`),
debajo del nombre comercial y sin alterar el RTN ni los datos de cada negocio.

Al entrar aparece la pantalla **«¿Qué módulo deseas usar?»** con una tarjeta por
módulo; el botón **← Módulos** regresa a esa pantalla en cualquier momento.

- **▣ Cotización · Vitra House** — datos del cliente, detalle por área (alto × ancho ÷ 144),
  cantidad, descuento, ISV, condiciones, monto en letras y cotización imprimible.
- **🪟 Materiales PVC** — ventanas del proyecto, perfiles, felpa, vinil, vidrio,
  tela mosquitera y herrajes; plan de cortes por lance, sobrantes y consolidado
  de fabricación. Genera una **hoja de materiales imprimible** (PDF) y su versión
  en Excel, con el resumen general, las ventanas, los materiales, el plan de
  cortes, el detalle de fabricación y espacio de firma para el taller. Toma el
  cliente y el proyecto de la pestaña de cotización. Para el administrador muestra además el costo de materiales
  frente al total cotizado y el margen.
- **◧ Presupuesto · Muebles Zacapa** — muebles por metro lineal (medida ML ×
  precio por ML), descuento, impuesto y observaciones. El presupuesto impreso
  muestra descripción, medida y total; el precio por metro lineal queda solo en
  pantalla, no se imprime. Imprime con la identidad,
  el RTN y la dirección de Representaciones e Inversiones Tinoco S. de R. L.
  Sus datos se editan en el bloque `EMPRESA_MZ` del archivo.
- **◴ Proyectos** — lista única de los dos negocios, con etiqueta de módulo,
  filtro por módulo y por estado, ver, editar, duplicar, eliminar. Al editar se
  abre automáticamente el módulo que corresponde.
- **⚙ Administración** — catálogo de materiales y precios, parámetros de cálculo
  (lance, moneda, decimales), datos de empresa, servidor y usuarios.

### Editar los precios de los materiales

En **Administración ▸ Catálogo de materiales y herrajes**:

1. Elija en *Lista de precios que está editando* el tipo de PVC (blanco o color
   madera). Cada uno guarda su propia lista.
2. Cambie el precio unitario, el contenido de la presentación o desactive los
   materiales que no use.
3. Presione **💾 Guardar y publicar precios**. Quedan guardados en el equipo y se
   envían a la hoja **CATALOGO_PVC** del servidor.

Los demás equipos reciben la lista nueva de dos formas:

- **Automáticamente**, al iniciar sesión o al sincronizar.
- **Al instante**, con el botón azul **⟳ Actualizar precios**, disponible para
  todos los usuarios. Sirve cuando el administrador acaba de cambiar un precio y
  el vendedor necesita cotizar con el valor correcto sin cerrar sesión.

El recuadro *Estado del catálogo* indica de dónde vienen los precios en uso:
originales del sistema, propios sincronizados con el servidor, o propios guardados
solo en ese dispositivo (aviso ámbar, cuando no hay conexión).

**↺ Restaurar originales** devuelve el catálogo local a los valores de fábrica.
No borra lo publicado en el servidor: para eso hay que restaurar y volver a
publicar, o limpiar la hoja CATALOGO_PVC.

Los materiales de la **cotización** (PVC blanco / color madera con su precio por
ft²) se editan aparte, en ⚙ Configuración.

La cotización de vidriería y el cálculo de materiales de PVC comparten el mismo
proyecto: al guardar se almacenan juntos. Los presupuestos de muebles se guardan
como proyectos aparte, en la misma lista.

En el servidor, los números de vidriería usan el prefijo `COT` y los de muebles
el prefijo `MZ`, cada uno con su propio correlativo.

## 1d. Respaldo, papelera y conflictos

**Respaldo** (Administración ▸ Respaldo de información): **Descargar respaldo**
genera un archivo `.json` con todos los proyectos, la papelera, la configuración y
la lista de precios. **Restaurar respaldo** lo vuelve a cargar en cualquier equipo:
agrega lo que falte y actualiza lo que sea más reciente, **nunca borra**.
Conviene descargarlo una vez por semana, sobre todo si trabajan sin servidor.

**Papelera**: eliminar ya no es definitivo. Los proyectos se conservan 90 días y se
pueden **restaurar** desde Administración, o borrar definitivamente uno por uno.

**Conflictos**: si dos personas editan la misma cotización sin conexión, el
servidor detecta cuál versión tenía cada quien. En lugar de perder una, guarda la
segunda como copia con el número marcado `(copia)`, la lista la señala con una
etiqueta roja y ambos usuarios reciben aviso para decidir cuál conservar.

## 1e. Endurecer el acceso

Por defecto las contraseñas están en claro en `AJUSTES_FABRICA`, lo cual es cómodo
pero legible en un repositorio público. Dos medidas, ambas opcionales:

1. **Contraseña cifrada.** En Administración ▸ Usuarios ▸ *Contraseña cifrada*
   escriba usuario y clave y presione **Generar**. Copia al portapapeles una línea
   como `{ usuario:"ventas1", pinHash:"a3f...", nombre:"Ventas 1", rol:"operador" },`
   que reemplaza a la del usuario en `AJUSTES_FABRICA`. La clave deja de ser legible.
2. **Exigir servidor.** En `AJUSTES_FABRICA` ponga `exigirServidor: true`. Entonces
   solo se entra validando contra la hoja **USUARIOS** de Google Sheets, y la lista
   del archivo deja de servir. Es la opción más segura, pero **sin internet nadie
   podrá entrar**.

## 2. Publicar en GitHub Pages

### Opción A — desde el navegador (sin instalar nada)

1. Entre a <https://github.com> ▸ botón **New** ▸ nombre del repositorio, por ejemplo
   `vitra-cotizaciones` ▸ visibilidad **Public** ▸ **Create repository**.
2. En el repositorio vacío: **uploading an existing file**.
3. Arrastre **todo el contenido** de la carpeta (index.html, sw.js, manifest, la
   carpeta `assets` completa y `.nojekyll`) ▸ **Commit changes**.
4. Pestaña **Settings** ▸ menú lateral **Pages**.
5. En *Source* elija **Deploy from a branch**; en *Branch* elija **main** y carpeta
   **/ (root)** ▸ **Save**.
6. Espere entre 1 y 3 minutos. La dirección quedará así:

   ```
   https://SU-USUARIO.github.io/vitra-cotizaciones/
   ```

> Si el archivo `.nojekyll` no se le sube desde el navegador, no hay problema:
> este proyecto no usa carpetas que empiecen con guion bajo. Súbalo si puede.

### Opción B — desde Git

```bash
git init
git add .
git commit -m "Vitra House v7.0.0"
git branch -M main
git remote add origin https://github.com/SU-USUARIO/vitra-cotizaciones.git
git push -u origin main
```

Luego active Pages igual que en el paso 5 anterior.

### Instalar en el celular

Abra la dirección en Chrome (Android) o Safari (iPhone) y use
**Agregar a pantalla de inicio**. Queda como una aplicación y abre sin internet.

---

## 3. Instalar el servidor (Google Apps Script)

1. Cree una hoja nueva en <https://sheets.google.com> y llámela, por ejemplo,
   `Vitra House - Cotizaciones`.
2. Menú **Extensiones ▸ Apps Script**.
3. Borre todo el contenido del editor y pegue el archivo `apps-script/Codigo.gs`.
4. Guarde (💾) y ejecute la función **`instalar`** ▸ autorice los permisos
   (aparecerá una advertencia de Google: *Configuración avanzada ▸ Ir a...*, es normal
   porque el script es suyo).
5. Se crearán las hojas **CONFIG, MATERIALES, USUARIOS, PROYECTOS, BITACORA**.
6. Botón azul **Implementar ▸ Nueva implementación**:
   - Tipo: **Aplicación web**
   - Descripción: `v7.0.0`
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**  ← indispensable
7. Copie la **URL de la aplicación web** (termina en `/exec`).

### Conectar la aplicación (se hace UNA sola vez, en el código)

Abra `index.html` con el Bloc de notas. En las primeras líneas del bloque
`<script>` está esto:

```js
const AJUSTES_FABRICA = {
  apiUrl  : "",        // ← pegue aquí la URL que termina en /exec
  usuario : "admin",
  pin     : "1234",
  autoLogin: true
};
```

Pegue la URL entre las comillas, guarde y suba ese `index.html` a GitHub.
Desde ese momento la app entra sola: el usuario final no ve la pantalla de
conexión ni tiene que escribir nada.

> El repositorio de GitHub Pages es público, de modo que el PIN escrito ahí
> puede ser leído por alguien que revise el código. Use una cuenta de uso común
> (`ventas`) y reserve el PIN de `admin` para usted. Si prefiere que cada
> persona escriba su PIN, deje `pin: ""` y aparecerá la pantalla de acceso.

### Conexión manual (solo si dejó `apiUrl` vacío)

En la app ▸ **⚙ Configuración**:

| Campo   | Valor                              |
|---------|------------------------------------|
| URL     | la que termina en `/exec`          |
| Usuario | `admin`                            |
| PIN     | `1234`                             |

Presione **Probar conexión** y luego **Iniciar sesión**.
Cambie el PIN en la hoja **USUARIOS** en cuanto todo funcione.

---

## 4. Cómo funciona la nube

- **Todo se guarda primero en el dispositivo.** Si no hay internet, la app sigue
  trabajando y marca los proyectos con un punto naranja ● (pendientes).
- Al recuperar la conexión, o al presionar **⟳ Sincronizar**, los pendientes suben
  y se descargan los proyectos de los demás usuarios.
- El **número de cotización** (`COT-2026-0001`) lo asigna el servidor, así nunca se
  repite entre vendedores.

### Usuarios y roles (hoja USUARIOS)

| Columna  | Contenido                                       |
|----------|-------------------------------------------------|
| USUARIO  | nombre de acceso, sin espacios                  |
| PIN      | clave numérica                                  |
| NOMBRE   | nombre que se muestra en pantalla               |
| ROL      | `admin` o `vendedor`                            |
| ACTIVO   | `TRUE` / `FALSE`                                |

- **vendedor**: solo ve y edita sus propias cotizaciones.
- **admin**: ve, edita y elimina las de todos.

### Configuración central (hoja CONFIG)

Lo que cambie ahí (empresa, RTN, teléfono, ISV, validez, condiciones, prefijo del
correlativo, área mínima por pieza) se aplica a todos los dispositivos al
sincronizar. Los precios de materiales se administran en la hoja **MATERIALES**.

---

## 5. Qué se corrigió y qué se agregó

**Correcciones**

- El logo iba incrustado dos veces en base64 (2.3 MB) y no aparecía en el PDF.
  Ahora va una sola vez y optimizado (89 KB): se ve siempre, también sin internet
  y aunque la carpeta `assets` no se haya subido.
- En el encabezado y en la cotización el logo va a la izquierda y los datos de la
  empresa a la derecha, también al imprimir desde el celular.
- Al imprimir, el navegador ya no titula la hoja «Cálculo de Presupuesto»: usa
  «Cotizacion COT-2026-0001 - Cliente», que es además el nombre que propone al
  guardar el PDF. El pie del documento lleva fecha y hora.
- El PDF y el historial abrían ventanas emergentes, que los navegadores de celular
  bloquean. Ahora la cotización se muestra dentro de la misma pantalla y se imprime
  desde ahí.
- Los proyectos se guardaban usando el nombre como clave: dos proyectos con el
  mismo nombre se sobrescribían. Ahora cada uno tiene identificador propio.
- No había forma de eliminar proyectos guardados.
- El cambio de material preguntaba por el precio incluso cuando no hacía falta.
- Los totales de línea se sumaban sin redondear, de modo que el total impreso podía
  diferir por centavos de la suma de las líneas.
- El descuento admitía valores fuera del rango 0–100.
- Cada ventana emergente cargaba una hoja de estilos móvil que no le correspondía.

**Agregados**

- Columna **Cantidad** (antes había que repetir la línea por cada pieza igual).
- **ISV** configurable (exento / 15 % / 18 %) y **área mínima por pieza**.
- **Número de cotización** correlativo y **validez de la oferta** con fecha de
  vencimiento calculada.
- **Estado** de la cotización: Borrador, Enviada, Aprobada, Rechazada.
- Buscador y filtro en los proyectos guardados; botones **Ver, Editar, Duplicar,
  Eliminar**.
- Cotización con **monto en letras**, condiciones y datos del cliente.
- Exportación a **Excel** (con respaldo en CSV si no hay internet).
- **Materiales y precios editables** desde la app o desde la hoja MATERIALES.
- Sincronización en la nube, sesión con usuario y PIN, y bitácora de movimientos.
- Instalable en el celular y funcional sin conexión.
- Los proyectos de la versión anterior se importan automáticamente la primera vez.

---

## 6. Publicar una versión nueva

1. Suba el `index.html` modificado al repositorio.
2. **Abra `sw.js` y cambie la línea** `const CACHE_VERSION = 'vitra-v7.0.0';`
   por un número distinto (`vitra-v7.0.1`, etc.).

Si olvida ese paso, los celulares que ya abrieron la app seguirán viendo la versión
vieja guardada en caché.

---

## 7. Solución de problemas

| Síntoma | Causa y solución |
|---|---|
| Aparece «Hay piezas que no caben en el lance» | Una ventana es más larga que el lance disponible. Esas piezas **no** están incluidas en la cantidad a comprar. Divida la ventana en secciones o aumente la longitud del lance en Administración. |
| Un número de cotización lleva «L» (COT-2026-L0003) | Se generó sin conexión. Al sincronizar, el servidor lo reemplaza por el correlativo definitivo. |
| Los precios no llegan a otro equipo | El administrador no presionó **Guardar y publicar precios**, o el servidor no tiene la hoja CATALOGO_PVC. Ejecute **instalar()** de nuevo en Apps Script: crea la hoja sin borrar datos. |
| Un operador ve «trabajando sin servidor» | Su usuario no existe en la hoja USUARIOS. En Apps Script ejecute **Agregar usuarios faltantes** (menú *Vitra House* de la hoja), o agréguelo a mano. Mientras tanto trabaja normal, pero sus cotizaciones quedan solo en su equipo. |
| «El servidor no devolvió datos válidos» | La implementación no tiene acceso **Cualquier persona**. Vuelva a implementar. |
| «Sin conexión con el servidor» | URL mal copiada (debe terminar en `/exec`) o no hay internet. |
| Cambié el código del Apps Script y no se refleja | Cada cambio requiere **Implementar ▸ Administrar implementaciones ▸ ✏️ ▸ Versión: Nueva**. |
| El celular muestra la versión anterior | No se cambió `CACHE_VERSION` en `sw.js`. |
| Un vendedor no ve una cotización | Fue creada por otro usuario. Solo el rol `admin` ve todas. |

---

Desarrollado por **José V. Molina** · Contralor · GSQ Honduras S.A.
