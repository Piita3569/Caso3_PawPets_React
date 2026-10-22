# PawPets 🐾

**Proyecto de Desarrollo Full Stack II — Evaluación 2**

PawPets es una tienda de productos para mascotas desarrollada con React, Vite, Bootstrap y React Router. Incluye catálogo, carrito de compras, simulación de pagos, gestión de usuarios y herramientas administrativas.

## Tecnologías utilizadas

- React 19
- Vite 8
- React Router 7
- Bootstrap 5
- JavaScript
- Jasmine y Karma para pruebas automatizadas
- ESLint para revisión del código

## Instalación y ejecución

Se requiere Node.js compatible con Vite 8 y npm.

```bash
npm ci
npm run dev
```

Para generar la compilación de producción:

```bash
npm run build
```

Para ejecutar las pruebas automatizadas:

```bash
npm test -- --single-run
```

Las pruebas requieren Chrome o Chromium configurado para Karma.

## Funcionalidades principales

### Tienda

- Página de inicio y navegación adaptable.
- Catálogo de productos, categorías y ofertas.
- Búsqueda y detalle de productos.
- Carrito con control de cantidades y cálculo del total.
- Checkout con datos del cliente.
- Entrega a domicilio o retiro.
- Pago simulado con resultado exitoso o fallido y opción de reintento.

### Usuarios y autenticación

- Registro e inicio de sesión simulados.
- Roles de cliente, vendedor y administrador.
- Edición de perfil.
- Gestión administrativa de usuarios.
- Sesión mediante `sessionStorage`.
- Protección de rutas según el rol.
- Navegación diferenciada según la sesión activa.

### Administración

- CRUD de productos con validaciones.
- CRUD de categorías con validaciones.
- Gestión de usuarios.
- Reportes de ventas simuladas.
- Historial de pedidos de la sesión.
- Detalle de pedidos y comprobantes imprimibles.

## Datos y almacenamiento

El catálogo inicial se carga desde `src/datos/productos.json` y `src/datos/categorias.json`.

Los productos y categorías modificados, el carrito y los pedidos se mantienen en estado React. Estos datos pueden perderse al recargar la página.

La autenticación es simulada y utiliza `sessionStorage`. La gestión de usuarios utiliza el servicio local implementado en el proyecto.

El sistema no cuenta con una pasarela de pagos real ni con un backend para procesar compras. Los comprobantes generados son demostrativos y no constituyen documentos tributarios.

La protección de rutas controla la navegación de React, pero no reemplaza la autorización de un servidor real.

## Pruebas y validaciones

Última validación: **22 de octubre de 2026**.

- **55 pruebas Jasmine/Karma aprobadas.**
- **0 pruebas fallidas.**
- Compilación Vite exitosa.
- ESLint sin errores en los archivos revisados durante la integración.

Las pruebas automatizadas comprueban funcionalidades de catálogo, productos, categorías, carrito, checkout, sesiones, usuarios, reportes, protección de rutas y navegación por roles.

## Estado del proyecto

Las funcionalidades descritas corresponden a la implementación académica actual de PawPets.

Queda pendiente contrastar el proyecto con la rúbrica oficial de la Evaluación 2 y completar la revisión visual en dispositivos móviles, tabletas y computadores.