import { categoriasIniciales } from '../datos/categorias.js'
import { listarProductos } from './productos.js'

const CLAVE_CATEGORIAS = 'pawpets_categorias'

export function listarCategorias() {
  const guardadas = localStorage.getItem(CLAVE_CATEGORIAS)

  if (guardadas === null) {
    localStorage.setItem(CLAVE_CATEGORIAS, JSON.stringify(categoriasIniciales))
    return [...categoriasIniciales]
  }

  return JSON.parse(guardadas)
}

export function buscarCategoria(id) {
  return listarCategorias().find(categoria => categoria.id === Number(id)) ?? null
}

export function crearCategoria(datosCategoria) {
  const categorias = listarCategorias()
  const nombre = String(datosCategoria.nombre ?? '').trim()

  if (!nombre) {
    throw new Error('El nombre de la categoria es obligatorio.')
  }

  const duplicada = categorias.some(
    categoria => categoria.nombre.toLowerCase() === nombre.toLowerCase()
  )

  if (duplicada) {
    throw new Error('Ya existe una categoria con ese nombre.')
  }

  const nuevoId = Math.max(0, ...categorias.map(categoria => categoria.id)) + 1
  const nuevaCategoria = { id: nuevoId, nombre }

  localStorage.setItem(CLAVE_CATEGORIAS, JSON.stringify([...categorias, nuevaCategoria]))
  return nuevaCategoria
}

export function actualizarCategoria(id, datosActualizados) {
  const categorias = listarCategorias()
  const indice = categorias.findIndex(categoria => categoria.id === Number(id))

  if (indice === -1) {
    throw new Error('La categoria no existe.')
  }

  const nombre = String(datosActualizados.nombre ?? '').trim()

  if (!nombre) {
    throw new Error('El nombre de la categoria es obligatorio.')
  }

  const duplicada = categorias.some(
    categoria =>
      categoria.id !== Number(id) &&
      categoria.nombre.toLowerCase() === nombre.toLowerCase()
  )

  if (duplicada) {
    throw new Error('Ya existe una categoria con ese nombre.')
  }

  categorias[indice] = {
    ...categorias[indice],
    nombre
  }

  localStorage.setItem(CLAVE_CATEGORIAS, JSON.stringify(categorias))
  return categorias[indice]
}

export function eliminarCategoria(id) {
  const categorias = listarCategorias()
  const idCategoria = Number(id)

  if (!categorias.some(categoria => categoria.id === idCategoria)) {
    throw new Error('La categoria no existe.')
  }

  const productos = listarProductos()

  if (productos.some(producto => producto.categoriaId === idCategoria)) {
    throw new Error('No puedes eliminar una categoria que tiene productos asociados.')
  }

  const categoriasActualizadas = categorias.filter(
    categoria => categoria.id !== idCategoria
  )

  localStorage.setItem(CLAVE_CATEGORIAS, JSON.stringify(categoriasActualizadas))
  return true
}
