# Cambios respecto a MotoClick-Next

## Archivos conservados y adaptados

- `app/page.jsx`, `app/layout.jsx`, `app/catalogo/page.jsx`, `app/checkout/page.jsx`, `app/pedido/page.jsx`, `app/motocicleta/[slug]/page.jsx` y páginas informativas: estructura, contenidos y rutas conservadas con ajustes de conexión y precisión legal.
- `app/globals.css`: estilos de base originales conservados; reglas adicionales para panel operativo, cuenta, seguimiento, filtros, inventario y logística.
- `components/Header.jsx`, `Footer.jsx`, `PrivacyModal.jsx`, `Photo.jsx`, `ProductCard.jsx`, `CatalogView.jsx`, `ProductDetail.jsx`, `CartDrawer.jsx`, `CheckoutForm.jsx`, `ReceiptView.jsx`, `CartContext.jsx`, `SiteShell.jsx`: refactorizaciones selectivas de datos, inventario, rutas y compra.
- `lib/products.js`, `lib/checkout.js`: referencias iniciales y validaciones de tarjetas ficticias conservadas.
- `public/images/moto-01.svg ... moto-20.svg`: ilustraciones originales de respaldo conservadas; sin afirmar que representen el modelo exacto.
- `next.config.mjs`: exportación estática y entorno Next.js originales conservados.

## Nuevos archivos necesarios

- `lib/commerce.js`: estado compartido, transiciones de negocio, inventario, abastecimiento, pagos ficticios, distribución, cancelaciones y devoluciones.
- `components/CommerceContext.jsx`: persistencia local y migración de datos legados.
- `components/AdminDashboard.jsx`: módulos operativos integrados con acciones reales sobre el estado.
- `components/AccountView.jsx`, `components/TrackingView.jsx`, `components/HomeFeatured.jsx`.
- `app/admin/`, `app/cuenta/`, `app/seguimiento/`, `app/producto/`, `app/politicas/`: nuevas páginas para módulos faltantes y productos creados por administración.
- `public/images/acc-101.svg ... acc-104.svg`: ilustraciones locales conceptuales de accesorios.
- `tests/commerce.mjs`: regresión de operaciones y reglas de stock.
- `README.md`: manual actualizado, credenciales, escenario de evaluación y limitaciones.

## Razones de los cambios

- El estado anterior del carrito no estaba vinculado a inventario.
- El comprobante previo dependía de `sessionStorage`, no registraba venta, abastecimiento ni logística.
- No existían módulos administrativos, movimientos de existencias, VIN, proveedores, pedidos persistentes, entregas ni posventa.
- Las imágenes anteriores de Unsplash podían no representar el modelo exacto; ahora los productos traen ilustraciones identificadas, y pueden configurarse fotografías propias/autorizadas.

El sitio conserva la base Next.js y React y evita añadir bases de datos o bibliotecas no necesarias para esta demostración.
