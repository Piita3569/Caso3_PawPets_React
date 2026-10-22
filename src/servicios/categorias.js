export function crearCategoria(categorias, nombre) {
  const nombreLimpio = nombre?.trim()

  if (!nombreLimpio) {
    throw new Error('El nombre de la categoría es obligatorio.')
  }

  if (categorias.some(c => c.nombre.toLowerCase() === nombreLimpio.toLowerCase())) {
    throw new Error('Ya existe una categoría con ese nombre.')
  }

  const nuevoId = Math.max(0, ...categorias.map(c => c.id)) + 1

  return [...categorias, { id: nuevoId, nombre: nombreLimpio }]
}

export function editarCategoria(categorias, id, nombre) {
  const nombreLimpio = nombre?.trim()

  if (!nombreLimpio) {
    throw new Error('El nombre de la categoría es obligatorio.')
  }

  if (!categorias.some(c => c.id === id)) {
    throw new Error('La categoría no existe.')
  }

  if (categorias.some(c =>
    c.id !== id && c.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  )) {
    throw new Error('Ya existe una categoría con ese nombre.')
  }

  return categorias.map(c =>
    c.id === id ? { ...c, nombre: nombreLimpio } : c
  )
}

export function eliminarCategoria(categorias, productos, id) {
  if (!categorias.some(c => c.id === id)) {
    throw new Error('La categoría no existe.')
  }

  if (productos.some(p => p.categoriaId === id)) {
    throw new Error('No se puede eliminar una categoría con productos asociados.')
  }

  return categorias.filter(c => c.id !== id)
}
