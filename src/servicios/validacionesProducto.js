import { categoriasIniciales } from '../datos/categorias.js'

export function validarCategoriaProducto(categoriaId, categorias = categoriasIniciales) {
  const id = Number(categoriaId)

  if (!Number.isInteger(id) || !categorias.some(categoria => categoria.id === id)) {
    throw new Error('Debes seleccionar una categoria valida.')
  }

  return id
}
