# Adaptación del módulo de María Pía a JSON estático

Esta adaptación incorpora el trabajo preparado localmente según la aclaración del profesor del 15 de octubre: JSON estático ahora y conexión con una API más adelante.

## Ejecutar

```sh
npm ci
npm run dev
```

Comprobar la compilación y el código de la aplicación:

```sh
npm run build
npx eslint src
```

## Alcance de esta rama

- Conserva el inicio, encabezado, pie y diseño de la base original.
- `src/App.jsx` importa `src/datos/productos.json` y `categorias.json` y los entrega mediante props.
- `/admin/productos` permite consultar productos, abrir su detalle y filtrar stock crítico o agotado (stock menor o igual a cinco).
- `/admin/categorias` muestra las categorías y la cantidad de productos asociados.
- No se crean, editan ni eliminan productos o categorías desde la interfaz; no se lee ni escribe el catálogo en almacenamiento del navegador.
- Los cuatro productos y categorías mantienen sus datos originales. Para cambiar los datos de demostración se editan los JSON.

Esta rama incluye únicamente la adaptación del módulo de María Pía. Las páginas enlazadas en el encabezado que pertenecen a otros integrantes se integrarán con sus respectivos avances, conservando sus rutas.

## Pruebas

`src/pruebas/catalogo.spec.jsx` contiene cuatro pruebas Jasmine de componentes: renderizado sin almacenamiento, apertura y cierre del detalle, filtro de stock crítico y conteo de productos por categoría.

La adaptación local fue verificada el 15 de octubre con build, ESLint de `src` y cuatro pruebas Jasmine/Karma correctas en Chrome Headless. La configuración temporal de Karma no forma parte de esta rama: las pruebas deben conectarse al entorno común del equipo. No hay un comando `npm test` configurado ni porcentaje de cobertura calculado.

Queda pendiente la revisión visual en móvil, tableta y escritorio.

## Autoría

El trabajo original de María Pía conserva su historial Git. La autoría del commit que incorpora esta adaptación corresponde a quien realiza la integración; no sustituye las contribuciones personales que cada integrante debe hacer desde su propia cuenta.
