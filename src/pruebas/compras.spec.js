/* global describe, it, expect, spyOn */
import productos from '../datos/productos.json'
import { confirmarCompra, validarCliente } from '../servicios/compras.js'
import { agregarAlCarrito, cambiarCantidad, quitarDelCarrito } from '../servicios/carrito.js'

describe('Carrito y compra simulada de Andrés con JSON estático', () => {
  const cliente = {
    nombre: 'Cliente de prueba', email: 'prueba@gmail.com', direccion: 'Calle de prueba 123',
    region: 'Metropolitana', comuna: 'Santiago', entrega: 'domicilio'
  }

  it('agrega y quita productos sin almacenamiento ni modificar el carrito original', () => {
    const leer = spyOn(Storage.prototype, 'getItem')
    const guardar = spyOn(Storage.prototype, 'setItem')
    const original = []
    const carrito = agregarAlCarrito(original, productos[0])
    expect(original).toEqual([])
    expect(carrito).toEqual([{ productoId: productos[0].id, cantidad: 1 }])
    expect(quitarDelCarrito(carrito, productos[0].id)).toEqual([])
    expect(leer).not.toHaveBeenCalled()
    expect(guardar).not.toHaveBeenCalled()
  })

  it('impide cantidades superiores al stock y cantidades inválidas', () => {
    const producto = productos[0]
    const carrito = [{ productoId: producto.id, cantidad: 1 }]
    expect(() => cambiarCantidad(carrito, producto, producto.stock + 1)).toThrowError(/stock/)
    expect(() => cambiarCantidad(carrito, producto, 0)).toThrowError(/entero/)
    expect(() => cambiarCantidad(carrito, producto, 1.5)).toThrowError(/entero/)
  })

  it('construye el resumen sin cambiar el JSON ni guardar datos', () => {
    const leer = spyOn(Storage.prototype, 'getItem')
    const guardar = spyOn(Storage.prototype, 'setItem')
    const original = JSON.stringify(productos)
    const pedido = confirmarCompra([{ productoId: productos[0].id, cantidad: 2 }], cliente, productos, 7)
    expect(pedido.usuarioId).toBe(7)
    expect(pedido.total).toBe(productos[0].precio * 2)
    expect(pedido.productos[0].cantidad).toBe(2)
    expect(JSON.stringify(productos)).toBe(original)
    expect(leer).not.toHaveBeenCalled()
    expect(guardar).not.toHaveBeenCalled()
  })

  it('copia nombre y precio al resumen sin reutilizar el objeto del catálogo', () => {
    const ejemplos = productos.map(producto => ({ ...producto }))
    const pedido = confirmarCompra([{ productoId: ejemplos[0].id, cantidad: 1 }], cliente, ejemplos)
    ejemplos[0].nombre = 'Nombre de otra demostración'
    ejemplos[0].precio += 1000
    expect(pedido.productos[0].nombre).toBe(productos[0].nombre)
    expect(pedido.productos[0].precio).toBe(productos[0].precio)
  })

  it('rechaza una compra inválida y mantiene intactos los datos estáticos', () => {
    const original = JSON.stringify(productos)
    expect(() => confirmarCompra([{ productoId: productos[0].id, cantidad: productos[0].stock + 1 }], cliente, productos)).toThrowError(/stock/)
    expect(() => confirmarCompra([], cliente, productos)).toThrowError(/vacío/)
    expect(() => confirmarCompra([{ productoId: -1, cantidad: 1 }], cliente, productos)).toThrowError(/disponible/)
    expect(JSON.stringify(productos)).toBe(original)
  })

  it('valida el domicilio y permite retiro sin dirección', () => {
    expect(validarCliente({ ...cliente, comuna: 'Comuna no válida' })).toContain('comuna')
    expect(validarCliente({ ...cliente, direccion: '' })).toContain('dirección')
    expect(validarCliente({ ...cliente, entrega: 'retiro', direccion: '', region: '', comuna: '' })).toBe('')
  })
})
