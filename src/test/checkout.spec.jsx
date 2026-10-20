/* global describe, beforeEach, afterEach, it, expect, spyOn, jasmine */
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Checkout from '../paginas/Checkout.jsx'
import ResultadoCompra from '../paginas/ResultadoCompra.jsx'
import productos from '../datos/productos.json'
import { confirmarCompra } from '../servicios/compras.js'

describe('Checkout de Andrés: JSON estático y estado React', () => {
  let contenedor
  let root
  let entornoActAnterior
  const usuario = {
    id: 7, nombre: 'Cliente de prueba', email: 'prueba@gmail.com', direccion: 'Calle de prueba 123',
    region: 'Metropolitana', comuna: 'Santiago'
  }

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

  async function mostrar(confirmar) {
    function CompraPrueba() {
      const [carrito, setCarrito] = useState([{ productoId: productos[0].id, cantidad: 1 }])
      const [pedido, setPedido] = useState(null)

      function comprar(cliente, usuarioId) {
        const resumen = confirmar ? confirmar(cliente, usuarioId)
          : confirmarCompra(carrito, cliente, productos, usuarioId)
        setPedido(resumen)
        setCarrito([])
        return resumen
      }

      return (
        <>
          <p data-testid="elementos-carrito">{carrito.length}</p>
          <Routes>
            <Route path="/checkout" element={<Checkout carrito={carrito} productos={productos} usuario={usuario} onConfirmar={comprar} />} />
            <Route path="/compra/error" element={<ResultadoCompra fallido />} />
            <Route path="/compra/exito/:id" element={<ResultadoCompra pedido={pedido} />} />
          </Routes>
        </>
      )
    }
    await act(async () => root.render(
      <MemoryRouter initialEntries={['/checkout']}><CompraPrueba /></MemoryRouter>
    ))
  }

  it('autocompleta el formulario con el usuario recibido por props', async () => {
    const leer = spyOn(Storage.prototype, 'getItem')
    await mostrar(jasmine.createSpy('confirmar'))
    expect(contenedor.querySelector('#compra-nombre').value).toBe('Cliente de prueba')
    expect(contenedor.querySelector('#compra-direccion').value).toBe('Calle de prueba 123')
    expect(contenedor.querySelector('#compra-comuna').value).toBe('Santiago')
    expect(leer).not.toHaveBeenCalled()
  })

  it('muestra el fallo, conserva el carrito y permite reintentar', async () => {
    const confirmar = jasmine.createSpy('confirmar')
    const original = JSON.stringify(productos)
    await mostrar(confirmar)
    await act(async () => {
      const resultado = contenedor.querySelector('#compra-resultado')
      resultado.value = 'fallido'
      resultado.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await act(async () => contenedor.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
    expect(contenedor.textContent).toContain('No se pudo realizar el pago')
    expect(confirmar).not.toHaveBeenCalled()
    expect(contenedor.querySelector('[data-testid="elementos-carrito"]').textContent).toBe('1')
    expect(JSON.stringify(productos)).toBe(original)
    await act(async () => contenedor.querySelector('a[href="/checkout"]').click())
    expect(contenedor.querySelector('#compra-nombre').value).toBe('Cliente de prueba')
  })

  it('muestra el resumen exitoso y vacía el carrito sin modificar ni guardar el catálogo', async () => {
    const guardar = spyOn(Storage.prototype, 'setItem')
    const original = JSON.stringify(productos)
    await mostrar()
    await act(async () => contenedor.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
    expect(contenedor.textContent).toContain('Compra realizada con éxito')
    expect(contenedor.textContent).toContain(productos[0].nombre)
    expect(contenedor.querySelector('[data-testid="elementos-carrito"]').textContent).toBe('0')
    expect(JSON.stringify(productos)).toBe(original)
    expect(guardar).not.toHaveBeenCalled()
  })

  it('informa que el resumen no está disponible si no hay compra en memoria', async () => {
    await act(async () => root.render(
      <MemoryRouter initialEntries={['/compra/exito/1']}>
        <Routes><Route path="/compra/exito/:id" element={<ResultadoCompra />} /></Routes>
      </MemoryRouter>
    ))
    expect(contenedor.textContent).toContain('Resumen no disponible')
    expect(contenedor.textContent).toContain('Al recargar la página se reinicia')
  })
})
