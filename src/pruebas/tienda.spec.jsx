/* global describe, beforeEach, afterEach, it, expect, jasmine */
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import Catalogo from '../paginas/Catalogo.jsx'
import Carrito from '../paginas/Carrito.jsx'
import { cambiarCantidad } from '../servicios/carrito.js'

const productos = [
  { id: 1, nombre: 'Pelota', descripcion: 'Juguete', precio: 3000, stock: 10, categoriaId: 1, imagen: '', oferta: false },
  { id: 2, nombre: 'Correa', descripcion: 'Accesorio', precio: 5000, stock: 5, categoriaId: 2, imagen: '', oferta: true }
]

// Se ejecuta en un navegador con el entorno Jasmine/Karma común de Pablo.
describe('Tienda de Andrés: props, eventos y estado', () => {
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

  it('muestra los productos recibidos por props', async () => {
    await act(async () => root.render(
      <MemoryRouter><Catalogo productos={productos} onAgregar={() => {}} /></MemoryRouter>
    ))
    expect(contenedor.querySelectorAll('article').length).toBe(2)
    expect(contenedor.textContent).toContain('Pelota')
    expect(contenedor.textContent).toContain('Correa')
  })

  it('agrega el producto mediante un clic y muestra la confirmación', async () => {
    const agregar = jasmine.createSpy('agregar')
    await act(async () => root.render(
      <MemoryRouter><Catalogo productos={productos} onAgregar={agregar} /></MemoryRouter>
    ))
    await act(async () => contenedor.querySelector('article button').click())
    expect(agregar).toHaveBeenCalledWith(1)
    expect(contenedor.querySelector('[role="status"]').textContent).toContain('Producto agregado')
  })

  it('aumenta la cantidad y actualiza el total visible', async () => {
    function CarritoPrueba() {
      const [carrito, setCarrito] = useState([{ productoId: 1, cantidad: 1 }])
      return <Carrito carrito={carrito} productos={productos}
        onCambiarCantidad={(id, cantidad) => setCarrito(cambiarCantidad(carrito, productos.find(p => p.id === id), cantidad))}
        onEliminar={() => {}} onVaciar={() => {}} />
    }
    await act(async () => root.render(<MemoryRouter><CarritoPrueba /></MemoryRouter>))
    expect(contenedor.querySelector('[data-testid="total-carrito"]').textContent).toContain('3.000')
    await act(async () => contenedor.querySelector('[aria-label="Aumentar Pelota"]').click())
    expect(contenedor.querySelector('[aria-label="Cantidad de Pelota"]').textContent).toBe('2')
    expect(contenedor.querySelector('[data-testid="total-carrito"]').textContent).toContain('6.000')
  })
})
