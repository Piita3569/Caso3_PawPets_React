export function validarProducto(producto, categorias) {
  if (!producto.nombre?.trim()) {
    throw new Error('El nombre del producto es obligatorio.')
  }

  if (!producto.descripcion?.trim()) {
    throw new Error('La descripción del producto es obligatoria.')
  }

  if (!Number.isFinite(producto.precio) || producto.precio <= 0) {
    throw new Error('El precio debe ser mayor que cero.')
  }

  if (!Number.isInteger(producto.stock) || producto.stock < 0) {
    throw new Error('El stock debe ser un número entero no negativo.')
  }

  if (!categorias.some(categoria => categoria.id === producto.categoriaId)) {
    throw new Error('Debes seleccionar una categoría válida.')
  }

  if (typeof producto.imagen !== 'string') {
    throw new Error('La imagen debe ser una dirección de texto.')
  }

  if (typeof producto.oferta !== 'boolean') {
    throw new Error('El estado de oferta debe ser verdadero o falso.')
  }
}

export function crearProducto(productos, categorias, datos) {
  const nuevoProducto = {
    ...datos,
    nombre: datos.nombre?.trim(),
    descripcion: datos.descripcion?.trim(),
    imagen: datos.imagen?.trim() ?? ''
  }

  validarProducto(nuevoProducto, categorias)

  const nuevoId = Math.max(0, ...productos.map(producto => producto.id)) + 1

  return [
    ...productos,
    {
      ...nuevoProducto,
      id: nuevoId
    }
  ]
}

export function editarProducto(productos, categorias, id, datos) {
  const existente = productos.find(producto => producto.id === id)

  if (!existente) {
    throw new Error('El producto no existe.')
  }

  const actualizado = {
    ...existente,
    ...datos,
    id,
    nombre: datos.nombre?.trim() ?? existente.nombre,
    descripcion: datos.descripcion?.trim() ?? existente.descripcion,
    imagen: datos.imagen?.trim() ?? existente.imagen
  }

  validarProducto(actualizado, categorias)

  return productos.map(producto =>
    producto.id === id ? actualizado : producto
  )
}

export function eliminarProducto(productos, id) {
  if (!productos.some(producto => producto.id === id)) {
    throw new Error('El producto no existe.')
  }

  return productos.filter(producto => producto.id !== id)
}