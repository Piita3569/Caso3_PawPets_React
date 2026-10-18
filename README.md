# PawPets React — Evaluación 2

Base React/Vite/Bootstrap/React Router desarrollada por María Pía. Ver [la adaptación a JSON estático](ADAPTACION_JSON.md) para el alcance vigente, ejecución y pruebas del módulo. El texto siguiente corresponde a la plantilla original de Vite.

El módulo de Andrés incorpora catálogo público, búsqueda, categorías, ofertas, carrito, checkout y resultados de compra simulada. Ver [su documentación](documentacion/MODULO_ANDRES.md). El carrito y el último resumen usan `useState`: se conservan al navegar y se reinician al recargar. El stock del JSON no se modifica.

Rutas de tienda: `/productos`, `/productos/:id`, `/categorias`, `/categorias/:id`, `/ofertas`, `/carrito`, `/checkout`, `/compra/exito/:id` y `/compra/error`. Las rutas administrativas se conservan. El usuario del checkout se recibe opcionalmente por props; la conexión con el módulo de usuarios queda pendiente.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
