/* global describe, beforeEach, afterEach, it, expect, spyOn */
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import AdminProductos from '../paginas/AdminProductos.jsx'
import AdminCategorias from '../paginas/AdminCategorias.jsx'
import productos from '../datos/productos.json'
import categorias from '../datos/categorias.json'

describe('Catálogo estático de María Pía', () => {
  let contenedor
  let root
  let entornoActAnterior

  beforeEach(() => {
    entornoActAnterior = globalThis.IS_REACT_ACT_ENVIRONMENT
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    contenedor = document.createElement('div')
    document.body.appendChild(contenedor)
    root = createRoot(contenedor)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    contenedor.remove()
    globalThis.IS_REACT_ACT_ENVIRONMENT = entornoActAnterior
  })

  it('muestra los productos del JSON recibidos por props sin acceder al almacenamiento', async () => {
    const leer = spyOn(Storage.prototype, 'getItem')
    const guardar = spyOn(Storage.prototype, 'setItem')
    await act(async () => root.render(
      <MemoryRouter><AdminProductos productos={productos} categorias={categorias} /></MemoryRouter>
    ))
    expect(contenedor.querySelectorAll('tbody tr').length).toBe(productos.length)
    expect(contenedor.textContent).toContain(productos[0].nombre)
    expect(leer).not.toHaveBeenCalled()
    expect(guardar).not.toHaveBeenCalled()
    expect(contenedor.textContent).not.toContain('Nuevo producto')
    expect(contenedor.textContent).not.toContain('Eliminar')
  })

  it('abre y cierra el detalle del producto mediante clic', async () => {
    const copiaOriginal = JSON.stringify(productos)
    await act(async () => root.render(
      <MemoryRouter><AdminProductos productos={productos} categorias={categorias} /></MemoryRouter>
    ))
    expect(contenedor.querySelector('[aria-label="Detalle administrativo del producto"]')).toBeNull()
    await act(async () => contenedor.querySelector('tbody button').click())
    expect(contenedor.querySelector('[aria-label="Detalle administrativo del producto"]').textContent).toContain(productos[0].descripcion)
    await act(async () => contenedor.querySelector('section button').click())
    expect(contenedor.querySelector('[aria-label="Detalle administrativo del producto"]')).toBeNull()
    expect(JSON.stringify(productos)).toBe(copiaOriginal)
  })

  it('filtra el stock crítico y agotado sin modificar los productos', async () => {
    const ejemplos = [
      { ...productos[0], id: 101, nombre: 'Normal', stock: 8 },
      { ...productos[0], id: 102, nombre: 'Crítico', stock: 5 },
      { ...productos[0], id: 103, nombre: 'Agotado', stock: 0 }
    ]
    await act(async () => root.render(
      <MemoryRouter><AdminProductos productos={ejemplos} categorias={categorias} /></MemoryRouter>
    ))
    await act(async () => contenedor.querySelector('#solo-criticos').click())
    expect(contenedor.querySelectorAll('tbody tr').length).toBe(2)
    expect(contenedor.querySelector('tbody').textContent).not.toContain('Normal')
    expect(ejemplos.map(producto => producto.stock)).toEqual([8, 5, 0])
    await act(async () => contenedor.querySelector('#solo-criticos').click())
    expect(contenedor.querySelectorAll('tbody tr').length).toBe(3)
  })

  it('muestra las categorías del JSON y la cantidad de productos asociados', async () => {
    await act(async () => root.render(
      <MemoryRouter><AdminCategorias categorias={categorias} productos={productos} /></MemoryRouter>
    ))
    const filas = contenedor.querySelectorAll('tbody tr')
    expect(filas.length).toBe(categorias.length)
    expect(filas[0].textContent).toContain(categorias[0].nombre)
    expect(filas[0].querySelectorAll('td')[1].textContent).toBe(String(productos.filter(producto => producto.categoriaId === categorias[0].id).length))
    expect(contenedor.querySelector('button[type="submit"]')?.textContent).toContain('Crear categoría')
  })
})
