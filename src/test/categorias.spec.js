/* global describe, it, expect */

import categorias from '../datos/categorias.json'
import {
  crearCategoria,
  editarCategoria
} from '../servicios/categorias.js'
import productos from '../datos/productos.json'
import { eliminarCategoria } from '../servicios/categorias.js'

describe('CRUD de categorías de Pía', () => {

  it('crea una categoría sin modificar el JSON original', () => {
    const original = JSON.stringify(categorias)
    const resultado = crearCategoria(categorias, 'Higiene y cuidado')

    expect(resultado.length).toBe(categorias.length + 1)
    expect(resultado.at(-1).nombre).toBe('Higiene y cuidado')
    expect(JSON.stringify(categorias)).toBe(original)
  })

  it('rechaza nombres vacíos y duplicados', () => {
    expect(() => crearCategoria(categorias, '   '))
      .toThrowError(/obligatorio/)

    expect(() => crearCategoria(categorias, 'ALIMENTOS PARA PERROS'))
      .toThrowError(/existe/)
  })

  it('edita una categoría conservando su identificador', () => {
    const original = JSON.stringify(categorias)
    const resultado = editarCategoria(categorias, 1, 'Nutrición canina')

    expect(resultado[0].id).toBe(1)
    expect(resultado[0].nombre).toBe('Nutrición canina')
    expect(JSON.stringify(categorias)).toBe(original)
  })
    it('impide eliminar categorías con productos asociados', () => {
    expect(() => eliminarCategoria(categorias, productos, 1))
      .toThrowError(/productos asociados/)

    expect(categorias.length).toBe(4)
  })

  it('elimina una categoría sin productos asociados', () => {
    const ampliadas = crearCategoria(categorias, 'Higiene y bienestar')
    const resultado = eliminarCategoria(ampliadas, productos, 5)

    expect(resultado.length).toBe(categorias.length)
    expect(resultado.some(categoria => categoria.id === 5)).toBe(false)
    expect(categorias.length).toBe(4)
  })

  it('rechaza la eliminación de una categoría inexistente', () => {
    expect(() => eliminarCategoria(categorias, productos, 999))
      .toThrowError(/no existe/)
  })

})