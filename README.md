# MotoClick · Operación comercial integrada (proyecto académico)

**Versión 3.0 — actualización del prototipo original MotoClick-Next (Next.js / React)**

Esta entrega amplía el código previo en lugar de reemplazar la aplicación desde cero. Conserva sus rutas, diseño editorial general, componentes de producto y carrito, y cambia el checkout de un comprobante aislado a un conjunto coherente de operaciones de comercio, inventario, abastecimiento, entrega y posventa.

**AVISO:** Es una simulación local para evaluación académica. No recibe pagos, no factura, no transporta mercancía ni sirve para operar una tienda comercial con datos personales reales.

## Requisitos e instalación

- Node.js **20.9 o superior** (se recomienda Node 22).
- npm y conexión a internet para descargar dependencias la primera vez.
- Navegador reciente compatible con `localStorage` y Web Crypto para las cuentas de demostración.

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`. Para producir una exportación estática:

```bash
npm run build
```

Con `output: 'export'`, Next genera `out/` para alojamientos estáticos. Se conserva la configuración de exportación del proyecto anterior. La interfaz y el motor de datos funcionan **en un único navegador** sin servidor de datos.

Pruebas del motor comercial, ejecutables sin instalar React/Next:

```bash
npm test
```

## Accesos de demostración

| Acceso | Dirección | Datos |
|---|---|---|
| Tienda | `/` | Público / invitado |
| Catálogo | `/catalogo` | Público |
| Registro e inicio de sesión | `/cuenta` | Crear cuenta local de demostración |
| Seguimiento | `/seguimiento` | Número de pedido y correo usado al comprar; o cuenta local iniciada |
| Administración | `/admin` | PIN de demostración: **`MC-DEMO-2026`** |
| Aprobación de pago simulado | `/checkout` | Tarjeta **`4242 4242 4242 4242`**, vencimiento futuro, CVC **`123`** |
| Rechazo de pago simulado | `/checkout` | Tarjeta **`4000 0000 0000 0002`**, vencimiento futuro, CVC **`123`** |

El PIN y las cuentas locales **no representan un sistema seguro de autenticación**. Nunca introduzcas contraseñas que uses en otros sitios, datos de tarjetas reales ni información personal sensible.

## Flujo de evaluación recomendado

1. Entra a `/admin`; abre **Inventario** y observa las unidades físicas, reservadas y disponibles. La instalación inicial contiene 20 motocicletas y cuatro accesorios de muestra, con existencias ficticias. Cada motocicleta posee VIN simulados `SIM-...`, **no números de serie reales**.
2. Abre **Proveedores**. Los registros iniciales son ficticios; puedes añadir y editar uno. En **Productos**, registra un modelo nuevo, asigna un proveedor y comprueba que inicialmente tiene **0 existencias**.
3. En **Abastecimiento**, genera una orden de compra (OC) de varias unidades del nuevo producto. Confirma la OC. Registra una recepción parcial y, después, la segunda recepción. Observa cómo cambian **Inventario** y **Catálogo** únicamente al recibir mercancía.
4. Desde el catálogo, agrega una motocicleta al carrito. Revisa cantidad máxima disponible, subtotal sin IVA, IVA incluido en los precios y total. Elige el destino y transporte especializado en checkout.
5. Prueba primero la tarjeta de rechazo `4000 0000 0000 0002`. El sistema registra un intento fallido, pero **no modifica inventario** ni genera una compra. Repite con la tarjeta aprobada `4242 4242 4242 4242`.
6. Se crea un pedido `PED-...`, se reservan unidades, se asignan VIN y se generan órdenes de entrega. La disponibilidad baja, aunque la mercancía sigue físicamente en almacén. Imprime el comprobante desde `/pedido?orden=...` (Guardar como PDF desde el navegador).
7. En **Pedidos y ventas**, selecciona **Iniciar preparación** y después **Marcar listo para envío**. En **Logística**, asigna el transportista y registra **despacho**. **Aquí** disminuyen existencias físicas y reservadas a la vez, sin volver a reducir disponibles.
8. Cambia el envío a **En reparto**, simula una incidencia y reprogramación si lo deseas, y finalmente a **Entregado**. Revisa `/seguimiento` con el número y correo del comprador: debe reflejar los cambios administrativos.
9. Desde `/seguimiento`, presenta una solicitud de **devolución** de un pedido entregado. En **Posventa**, apruébala. Comprueba que el inventario no aumenta todavía. Confirma recepción e inspección: **entonces** regresan las unidades. Registra un reembolso simulado una sola vez.
10. Para el otro caso, crea otro pedido y solicita **cancelación antes del despacho**. Su aprobación libera reservas sin generar salida física. No se permite cancelar después de que la mercancía salió.

## Principales funcionalidades

### Tienda y clientes

- Catálogo con **20 motocicletas** y **4 accesorios** iniciales, además de productos añadidos desde administración.
- Filtros por categoría, marca y precio; búsqueda por nombre, marca, modelo y SKU; ordenamiento.
- Detalles con existencias disponibles calculadas desde el inventario, garantías y tiempos de entrega referenciales.
- Carrito persistente, validaciones de stock, desglose correcto del IVA **incluido** en los precios. El envío se añade sin cobrar IVA dos veces.
- Checkout local: entrega por sucursal, transporte especializado para motocicletas o paquetería para pedidos de accesorios; tarifas regionales simuladas.
- Formulario de pago exclusivamente ficticio. Rechazo sin modificar inventario; aprobación con pedido, reserva, movimiento de inventario y órdenes de entrega. La tarjeta y el CVC no se guardan en el almacenamiento persistente.
- Comprobante académico imprimible o guardable como PDF desde el navegador. No es CFDI.
- Registro, inicio y cierre de sesión de **cuentas locales simuladas**, edición de perfil y direcciones, historial de pedidos por correo y compras como invitado.
- Seguimiento por número de pedido y correo, con envíos independientes, guía, transportista, estado e historial real de eventos del motor local.
- Solicitudes de cancelación o devolución conectadas a administración.

### Panel administrativo

- Inicio operativo básico (sin informes estadísticos ni gráficas).
- Productos: alta, edición, activación/desactivación, costo interno, SKU y asociación con proveedor. Las fotografías del catálogo se sirven desde `public/images`; en administración puedes indicar una ruta local (por ejemplo, `/images/foto.JPG`) o una URL autorizada.
- Inventario: físico/reservado/disponible, stock mínimo, ajustes documentados, movimientos y VIN simulados.
- Proveedores: alta, edición, consulta y desactivación; lista de modelos suministrados.
- Compras: órdenes multirrenglón, estados válidos, recepciones totales o parciales sin entradas duplicadas.
- Pedidos: preparación, alistamiento, cambios de estado derivados de los envíos e historial.
- Logística: envíos separados para motocicletas y accesorios, transportistas, guías, despachos, entregas, incidencias y reprogramaciones.
- Clientes: registrados e invitados con sus pedidos.
- Posventa: aprobación/rechazo, cancelación con liberación de reserva, recepción de devoluciones y reembolsos ficticios protegidos contra duplicación.

## Regla de inventario

| Operación | Físico | Reservado | Disponible |
|---|---:|---:|---:|
| Recepción de proveedor | +N | 0 | +N |
| Compra aprobada | 0 | +N | −N |
| Despacho de pedido | −N | −N | sin cambio |
| Cancelación antes de despacho | 0 | −N | +N |
| Devolución recibida e inspeccionada | +N | 0 | +N |

Las motocicletas se representan individualmente mediante identificadores VIN **simulados** y cambian de estado (disponible, reservada, despachada, entregada). Los accesorios usan conteos enteros. No se aceptan existencias negativas y el motor verifica transiciones y unidades pendientes. Una operación se calcula sobre una copia y sólo se guarda si pasa todas las validaciones.

## Persistencia y migración

- `localStorage['motoclick_business_v3']`: documento completo versionado con productos, inventario, VIN, movimientos, proveedores, compras, carritos, clientes, pedidos, pagos ficticios, envíos, devoluciones y eventos.
- Al cargar por primera vez se inicializan únicamente datos demostrativos. Las cargas posteriores conservan modificaciones del usuario.
- Las fotos de motos y accesorios se asignan en `lib/products.js` y `lib/commerce.js`. La carga actualiza los registros predeterminados que todavía tenían imágenes SVG de respaldo, sin reemplazar las imágenes personalizadas.
- Se recupera el carrito compatible guardado previamente en `motoclick_v2_cart` si aún no existe el nuevo documento.
- El comprobante antiguo de la versión v2 no se transforma artificialmente en venta real: se deja constancia de migración cuando se detecta, porque no tenía reserva ni logística verificables.
- Un cambio en otra pestaña del **mismo navegador** se refleja mediante eventos `storage`.
- Borrar los datos del navegador elimina los registros. Para reiniciar el sistema, elimina manualmente la clave `motoclick_business_v3` desde las herramientas del navegador y recarga; **esto borra las operaciones anteriores**, por lo que hazlo solo con una copia de seguridad si la necesitas.

## Arquitectura y archivos relevantes

```text
MotoClick-Empresarial/
├── app/
│   ├── page.jsx              # Portada del prototipo, conservada y ajustada
│   ├── catalogo/             # Catálogo y filtros conectados al stock
│   ├── motocicleta/[slug]/   # URL legada, conservada
│   ├── producto/             # Ruta flexible para productos nuevos
│   ├── checkout/             # Compra de prueba
│   ├── pedido/               # Comprobante persistente
│   ├── admin/                # Panel de operación
│   ├── cuenta/               # Cuentas locales
│   ├── seguimiento/          # Seguimiento para clientes
│   ├── politicas/            # Envíos, garantías, devoluciones y términos
│   ├── nosotros/, ayuda/     # Contenido preexistente actualizado
│   └── globals.css          # Estilos originales más módulos específicos
├── components/
│   ├── CommerceContext.jsx  # Persistencia y acciones del motor
│   ├── CartContext.jsx      # API del carrito original adaptada
│   ├── AdminDashboard.jsx   # Nueve módulos operativos
│   ├── AccountView.jsx, TrackingView.jsx
│   ├── CheckoutForm.jsx, ReceiptView.jsx
│   └── Header.jsx, Footer.jsx, ...
├── lib/
│   ├── commerce.js          # Motor de negocio, invariantes y transiciones
│   ├── products.js          # 20 referencias iniciales heredadas
│   └── checkout.js          # Validación de tarjeta de prueba
├── public/images/           # Fotografías locales y recursos de respaldo
└── tests/commerce.mjs       # Pruebas sin servicios ni base de datos externa
```

## Verificación realizada

- Ejecutado `node tests/commerce.mjs`: pruebas de catálogo, proveedores, compras, recepción parcial, validación de cantidades, IVA, reserva, pago rechazado, despacho sin doble descuento, incidencias, entregas, cancelación, devolución, reembolso, productos nuevos y migración.
- Ejecutado `npm run build`: compilación de producción correcta y generación de las rutas estáticas, incluidas las páginas de motocicletas.
- Verificadas las 24 fotografías del catálogo y accesorios, sus rutas bajo `public/images` y su presencia en la exportación estática `out/images`.
- Revisada sintaxis de 36 archivos JS/JSX con el analizador de TypeScript disponible en el entorno de elaboración, sin errores sintácticos.
- Verificadas las rutas de 60 importaciones internas y el XML de 25 recursos SVG locales.

## Limitaciones explícitas y próximos pasos de producción

1. **Sin servidor, no hay seguridad ni transacciones concurrentes reales.** El PIN administrativo puede conocerse leyendo el código. El hash de contraseña en el navegador no equivale a autenticación segura. Usa únicamente información de prueba.
2. **No hay sincronización de inventario entre dispositivos o usuarios.** `localStorage` tiene límites de tamaño y las escrituras concurrentes de varias pestañas no tienen el aislamiento de una base de datos transaccional. Una implementación comercial necesita backend, autenticación, roles, base de datos y operaciones ACID.
3. **Sin Stripe real.** La interfaz no procesa números bancarios, no tokeniza tarjetas ni realiza reembolsos reales. Para producción se necesita un backend de pagos con confirmación mediante webhooks e idempotencia en servidor.
4. **Datos ficticios.** Precios, costos de adquisición, inventario inicial, VIN, garantías, transportistas, proveedores y plazos son de referencia académica. El catálogo y las secciones editoriales usan fotografías locales; la correspondencia exacta con cada versión/modelo y los derechos de uso deben confirmarse antes de publicar.
5. **Seguimiento y facturación simulados.** No se integran APIs de paquetería ni CFDI. Los documentos se identifican como académicos.
6. **Sin promociones ni reportes**, conforme al alcance solicitado.

Para convertirlo en una plataforma realmente multiusuario, el cambio de arquitectura mínimo sería conservar Next.js como interfaz y trasladar el motor de operaciones a una API con base de datos transaccional (por ejemplo, PostgreSQL), un sistema real de permisos y un servicio de pagos. Eso **no forma parte de esta entrega académica local**.
