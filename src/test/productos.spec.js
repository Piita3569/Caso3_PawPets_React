/* global describe, it, expect */

import productos from '../datos/productos.json'
import categorias from '../datos/categorias.json'
import {
  crearProducto,
  editarProducto,
  eliminarProducto
} from '../servicios/productos.js'

describe('CRUD administrativo de productos de Pía', () => {

  it('crea un producto con ID único sin modificar el JSON original', () => {
    const original = JSON.stringify(productos)

    const nuevo = {
      nombre: 'Champú para perros',
      descripcion: 'Producto de higiene para perros.',
      precio: 5990,
      imagen: '',
      categoriaId: 4,
      stock: 12,
      oferta: false
    }

    const resultado = crearProducto(productos, categorias, nuevo)

    expect(resultado.length).toBe(productos.length + 1)
    expect(resultado.at(-1).id).toBe(5)
    expect(resultado.at(-1).nombre).toBe('Champú para perros')
    expect(JSON.stringify(productos)).toBe(original)
  })

  it('rechaza productos sin nombre o con precio inválido', () => {
    const base = { ...productos[0] }

    expect(() => crearProducto(productos, categorias, {
      ...base,
      nombre: ''
    })).toThrowError(/nombre/)

    expect(() => crearProducto(productos, categorias, {
      ...base,
      precio: -100
    })).toThrowError(/precio/)
  })

  it('edita un producto conservando su ID', () => {
    const original = JSON.stringify(productos)

    const resultado = editarProducto(productos, categorias, 1, {
      nombre: 'Master Dog Adulto Premium',
      precio: 27990
    })

    expect(resultado[0].id).toBe(1)
    expect(resultado[0].nombre).toBe('Master Dog Adulto Premium')
    expect(resultado[0].precio).toBe(27990)
    expect(JSON.stringify(productos)).toBe(original)
  })

  it('elimina un producto sin modificar el catálogo original', () => {
    const original = JSON.stringify(productos)
    const resultado = eliminarProducto(productos, 1)

    expect(resultado.length).toBe(productos.length - 1)
    expect(resultado.some(producto => producto.id === 1)).toBe(false)
    expect(JSON.stringify(productos)).toBe(original)
  })

  it('rechaza la eliminación de productos inexistentes', () => {
    expect(() => eliminarProducto(productos, 999))
      .toThrowError(/no existe/)
  })

  it('rechaza stock negativo, decimal o categorías inexistentes', () => {
    const base = { ...productos[0] }

    expect(() => crearProducto(productos, categorias, {
      ...base, stock: -1
    })).toThrowError(/stock/)

    expect(() => crearProducto(productos, categorias, {
      ...base, stock: 1.5
    })).toThrowError(/stock/)

    expect(() => crearProducto(productos, categorias, {
      ...base, categoriaId: 999
    })).toThrowError(/categoría válida/)
  })

})