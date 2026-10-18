# Módulo de Andrés: catálogo estático y compra simulada

## Criterio vigente y alcance

El profesor confirmó que se debe utilizar JSON estático y que posteriormente se migrará a una API. Esta versión sustituye el diseño anterior con servicios CRUD y almacenamiento del navegador.

Incluye únicamente catálogo público, detalle, búsqueda, categorías, ofertas, carrito, checkout y resultados de compra de Andrés. Los datos del catálogo pertenecen a la base compartida de Pía. No implementa módulos administrativos, usuarios, historial ni reportes.

Se utilizan componentes funcionales, props, useState, eventos, formularios controlados, map/filter/reduce, React Router y Bootstrap. Las pruebas utilizan Jasmine, Karma, un contenedor DOM y act de React. No se agregan bibliotecas nuevas al módulo.

## Requisitos de este módulo para el ERS

| Código | Comportamiento |
| --- | --- |
| AND-01 | Mostrar en tarjetas reutilizables los productos recibidos desde el JSON compartido. |
| AND-02 | Mostrar el detalle del producto identificado en la ruta. |
| AND-03 | Buscar por nombre y mostrar productos por categoría o en oferta. |
| AND-04 | Agregar, cambiar cantidades, eliminar y vaciar el carrito; calcular subtotales y total. |
| AND-05 | Mantener el carrito en estado React mientras se navega, reiniciándolo al recargar. |
| AND-06 | Capturar nombre, correo y opción de entrega; exigir dirección, región y comuna para domicilio. |
| AND-07 | Autocompletar el checkout si el componente padre entrega un usuario por props. |
| AND-08 | Mostrar pago fallido y permitir reintento conservando carrito y formulario. |
| AND-09 | Ante pago exitoso, construir un resumen en memoria y vaciar el carrito sin alterar el JSON. |
| AND-10 | Mostrar el resumen mientras siga disponible en memoria e informar cuando no lo esté. |

## Organización de datos y estado

| Elemento | Ubicación |
| --- | --- |
| Productos | JSON compartido de Pía: `src/datos/productos.json`. |
| Categorías | JSON compartido de Pía: `src/datos/categorias.json`. |
| Regiones y comunas del formulario | Datos de demostración de la Evaluación 1 en `regionesCompra.js`. |
| Carrito | useState del componente padre; elementos `{ productoId, cantidad }`. |
| Último resumen de compra | useState del componente padre. |
| Usuario disponible | Prop recibida del módulo de usuarios al integrarlo. |

El ejemplo de App importa los dos JSON y entrega los datos mediante props tanto a las vistas de consulta de Pía como a la tienda. La futura API cambiará la obtención de los datos en el padre; las tarjetas podrán seguir recibiendo los mismos campos.

En esta versión no se leen ni escriben localStorage o sessionStorage. Los datos que hubiera guardado la versión anterior se ignoran, sin eliminarlos.

## Reglas del carrito y pago

- Cantidades enteras y positivas, sin superar el stock de muestra. Se elimina un producto con el botón correspondiente.
- El total es la suma de cantidad por precio; no se añaden tarifas, impuestos o descuentos adicionales.
- La validación de stock se hace al agregar, cambiar cantidades y confirmar la compra.
- El JSON permanece intacto tanto en éxito como en fallo. No hay inventario real ni reserva de unidades entre compras.
- El pago se simula con un selector de éxito/fallo; no realiza cobros.
- Si falla el pago, no se construye el resumen y se conserva el carrito. React Router conserva los datos del formulario para el reintento.
- Si tiene éxito, se construye una copia de cliente, productos, precios y cantidades; el padre conserva ese resumen y vacía el carrito.
- La dirección se exige para domicilio; retiro no necesita dirección.
- Las regiones y comunas son las dos regiones y seis comunas de demostración de la Evaluación 1.
- Al recargar se pierden carrito y resumen, igual que cualquier estado React sin persistencia.

## Autocompletado sin implementar el módulo de Luis

Checkout recibe una prop opcional `usuario`. Sin ella, se completa como invitado. No se lee una sesión del navegador ni se crean usuarios.

Formato esperado para coordinar con el módulo de usuarios:

```js
{
  id: 7,
  nombre: 'Cliente de prueba',
  email: 'prueba@gmail.com',
  direccion: 'Calle de prueba 123',
  region: 'Metropolitana',
  comuna: 'Santiago'
}
```

El ejemplo integrado acepta `App({ usuario = null })` y entrega la prop a Checkout. Al conectar el módulo del equipo, el padre debe pasar el usuario disponible. Esto es una interfaz de integración, no una implementación de login. Los casos de prueba usan un usuario ficticio por props.

## Resumen simulado

`confirmarCompra(carrito, cliente, productos, usuarioId)` recibe los productos como argumento y devuelve un objeto; no consulta servicios ni guarda datos.

```js
{
  id: 1792100000000, // identificador de demostración generado con Date.now()
  usuarioId: 7, // null para invitado
  cliente: { nombre: 'Cliente de prueba', email: 'prueba@gmail.com' },
  direccion: { calle: 'Calle de prueba 123', region: 'Metropolitana', comuna: 'Santiago' },
  entrega: 'domicilio', // o retiro; en retiro, direccion es null
  fecha: '2026-10-15T23:00:00.000Z',
  productos: [
    { productoId: 1, nombre: 'Producto', cantidad: 2, precio: 3000, subtotal: 6000 }
  ],
  total: 6000
}
```

El identificador es solo para la navegación y presentación de la simulación. No equivale a una orden registrada en un servidor. El resultado comprueba que el identificador de la ruta corresponde al último resumen disponible. La carga directa o recarga sin ese estado informa «Resumen no disponible».

## Pruebas propias

| Archivo | Cantidad | Casos |
| --- | --- | --- |
| `tienda.spec.jsx` | 3 | Renderizado por props; clic para agregar; cambio de cantidad y total visible. |
| `compras.spec.js` | 6 | Agregar/quitar sin almacenamiento; cantidades inválidas; resumen sin mutación del JSON; copia de nombre/precio; compra inválida; domicilio y retiro. |
| `checkout.spec.jsx` | 4 | Autocompletado por props; fallo y reintento; éxito con carrito vacío y catálogo intacto; resultado sin resumen disponible. |

Las pruebas de componentes simulan eventos en el DOM. Se desmonta el componente al finalizar cada caso. Los spies sobre Storage verifican que el módulo no utiliza almacenamiento. Los datos de ejemplo modificados durante una prueba son copias, no el JSON compartido.

## Resultados ejecutados el 15 de octubre de 2026

Se utilizó `tmp/verificacion_andres_json`, una copia temporal de `maria_pia` con los archivos de Andrés y el ejemplo de App integrado. No se cambió el repositorio del equipo ni la carpeta de Pía.

| Comprobación | Resultado |
| --- | --- |
| Compilación de producción Vite | Correcta: 51 módulos transformados. |
| ESLint de todo src integrado | Correcto, sin errores. |
| Pruebas Jasmine/Karma en Chrome Headless | 17 de 17 correctas: 13 de Andrés y 4 de Pía. |
| Revisión visual responsiva | Pendiente de comprobación manual. |
| Integración con el usuario real del módulo de Luis | Pendiente de acuerdo y conexión por props. |
| Cobertura porcentual | No calculada. |

Las pruebas se compilaron con Vite y se ejecutaron en Karma 6.4.4, karma-jasmine 5.1.0 y Chrome Headless. La configuración temporal no se incluye en la carpeta de Andrés; se deben incorporar sus archivos al entorno de pruebas común del equipo.

## Verificación de la integración del 18 de octubre de 2026

Se integró este módulo en la rama `trabajo-andres`, sobre `main` con la adaptación JSON de Pía ya incorporada (merge `a488afa`). Se conservaron sus rutas administrativas y se añadieron las rutas públicas de tienda y compra en `src/App.jsx`.

- Build de producción correcto: 51 módulos transformados.
- ESLint de `src` correcto.
- 17 de 17 pruebas Jasmine/Karma correctas en Chrome Headless (13 de Andrés y 4 de Pía), ejecutadas sobre una copia temporal actualizada desde esta integración.
- No se agregaron dependencias ni configuración temporal de testing al repositorio.
- Siguen pendientes la revisión visual responsiva, la conexión al usuario real y el cálculo de cobertura.

Andrés debe revisar el código y aportar evidencias propias al informe.

## Puntos para explicar en la presentación

1. El JSON se importa en el padre y llega a los componentes mediante props.
2. Catalogo filtra por nombre y ListaProductos recorre los datos con map.
3. Producto llama a una función del padre cuando se pulsa agregar.
4. useState mantiene el carrito y actualiza total y contador sin cambiar el catálogo.
5. Checkout valida el formulario y simula éxito o fallo.
6. Las pruebas comprueban resultados visibles y que los datos estáticos no se modifican.
