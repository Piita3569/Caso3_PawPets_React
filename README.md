# PawPets

Proyecto de Desarrollo Full Stack II, Evaluación 2. Tienda de productos para mascotas desarrollada con React, Vite, Bootstrap y React Router.

## Instalación y ejecución

Se requiere Node.js compatible con Vite 8 y npm.

```sh
npm ci
npm run dev
```

Para generar la versión de producción y revisar el código:

```sh
npm run build
npx eslint src
```

## Funcionalidades

- Inicio y navegación responsiva.
- Catálogo con búsqueda, detalle de productos, categorías y ofertas.
- Carrito con cantidades, eliminación de productos y cálculo del total.
- Checkout con datos del cliente, entrega a domicilio o retiro y pago simulado.
- Resultado de compra exitosa y pago fallido con reintento.
- Consulta administrativa de productos y categorías, detalle y filtro de stock crítico.

Los productos y categorías se cargan desde `src/datos/productos.json` y `src/datos/categorias.json`. El carrito y el resumen de compra se mantienen en estado React y se reinician al recargar. La compra es una simulación: no realiza cobros, no guarda pedidos ni modifica el stock del JSON.

El checkout admite un usuario opcional por props. La integración con las páginas de usuarios, contacto, contenido y seguimiento está pendiente.

## Pruebas

Los archivos de `src/pruebas` contienen 17 pruebas Jasmine. La última ejecución del 18 de octubre de 2026 obtuvo 17/17 resultados correctos con Karma y Chrome Headless en un entorno temporal. También se verificaron la compilación de producción y ESLint de `src`.

La configuración común de Karma todavía no está incorporada al repositorio y no hay un comando `npm test` disponible. Quedan pendientes la revisión visual en móvil, tableta y escritorio y el cálculo de cobertura.
