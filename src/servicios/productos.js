import { productosIniciales } from '../datos/productos.js'
import { listarCategorias } from './categorias.js'
import { validarCategoriaProducto } from './validacionesProducto.js'

const CLAVE_PRODUCTOS = 'pawpets_productos'

export function listarProductos() {
  const guardados = localStorage.getItem(CLAVE_PRODUCTOS)

  if (guardados === null) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productosIniciales))
    return [...productosIniciales]
  }

  return JSON.parse(guardados)
}

export function buscarProducto(id) {
  return listarProductos().find(producto => producto.id === Number(id)) ?? null
}

export function crearProducto(datosProducto) {
  const productos = listarProductos()

  const nombre = String(datosProducto.nombre ?? '').trim()
  const precio = Number(datosProducto.precio)
  const stock = Number(datosProducto.stock)

  if (!nombre) throw new Error('El nombre es obligatorio.')
  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error('El precio debe ser mayor que cero.')
  }
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock debe ser un numero entero no negativo.')
  }

  const nuevoId = Math.max(0, ...productos.map(p => p.id)) + 1
  const nuevoProducto = {
    ...datosProducto,
    id: nuevoId,
    nombre,
    precio,
    stock,
    categoriaId: validarCategoriaProducto(datosProducto.categoriaId, listarCategorias())
  }

  localStorage.setItem('pawpets_productos', JSON.stringify([...productos, nuevoProducto]))
  return nuevoProducto
}

export function actualizarProducto(id, datosActualizados) {
  const productos = listarProductos()
  const indice = productos.findIndex(producto => producto.id === Number(id))

  if (indice === -1) {
    throw new Error('El producto no existe.')
  }

  const productoActualizado = {
    ...productos[indice],
    ...datosActualizados,
    id: productos[indice].id
  }

  const nombre = String(productoActualizado.nombre ?? '').trim()
  const precio = Number(productoActualizado.precio)
  const stock = Number(productoActualizado.stock)

  if (!nombre) throw new Error('El nombre es obligatorio.')
  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error('El precio debe ser mayor que cero.')
  }
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock debe ser un numero entero no negativo.')
  }

  productos[indice] = {
    ...productoActualizado,
    nombre,
    precio,
    stock,
    categoriaId: validarCategoriaProducto(productoActualizado.categoriaId, listarCategorias())
  }

  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
  return productos[indice]
}

export function eliminarProducto(id) {
  const productos = listarProductos()
  const idProducto = Number(id)

  const existe = productos.some(producto => producto.id === idProducto)

  if (!existe) {
    throw new Error('El producto no existe.')
  }

  const productosActualizados = productos.filter(
    producto => producto.id !== idProducto
  )

  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productosActualizados))
  return true
}
