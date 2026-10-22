/* global describe, it, expect, afterEach */
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminReportes from '../paginas/AdminReportes.jsx'
import DetallePedido from '../paginas/DetallePedido.jsx'

afterEach(() => cleanup())

describe('Reportes administrativos de PawPets', () => {
  it('muestra ventas en cero y un mensaje cuando no existen pedidos', () => {
    render(
      <MemoryRouter>
        <AdminReportes productos={[]} pedidos={[]} />
      </MemoryRouter>
    )

    expect(screen.getByText('$0')).toBeTruthy()
    expect(screen.getByText('No hay compras registradas en esta sesión.')).toBeTruthy()
  })
})

describe('Cálculo de ventas en reportes', () => {
  it('suma correctamente los pedidos registrados durante el mes', () => {
    const fecha = new Date().toISOString()
    const pedidos = [
      { id: 101, cliente: { nombre: 'Cliente Uno' }, fecha, total: 10000, entrega: 'retiro' },
      { id: 102, cliente: { nombre: 'Cliente Dos' }, fecha, total: 15000, entrega: 'domicilio' }
    ]

    render(
      <MemoryRouter>
        <AdminReportes productos={[]} pedidos={pedidos} />
      </MemoryRouter>
    )

    expect(screen.getByText('$25.000')).toBeTruthy()
    expect(screen.getByText('Cliente Uno')).toBeTruthy()
    expect(screen.getByText('Cliente Dos')).toBeTruthy()
    expect(screen.getAllByRole('link', { name: 'Ver detalle' }).length).toBe(2)
  })
})

describe('Detalle de pedidos de PawPets', () => {
  it('informa cuando el pedido solicitado no existe', () => {
    render(<DetallePedido pedido={undefined} />)

    expect(screen.getByRole('heading', { name: 'Pedido no disponible' })).toBeTruthy()
    expect(screen.getByText('No se encontró la compra solicitada en el historial de esta sesión.')).toBeTruthy()
  })
})

describe('Comprobante de compra simulada', () => {
  it('muestra los datos del pedido, su producto y el total', () => {
    const pedido = {
      id: 103,
      fecha: '2026-10-22T15:00:00.000Z',
      cliente: { nombre: 'Cliente Prueba', email: 'prueba@pawpets.cl' },
      entrega: 'retiro',
      direccion: null,
      productos: [
        { productoId: 1, nombre: 'Hueso de goma', cantidad: 2, precio: 3500, subtotal: 7000 }
      ],
      total: 7000
    }

    render(
      <MemoryRouter>
        <DetallePedido pedido={pedido} />
      </MemoryRouter>
    )

    expect(screen.getByText(/SIN VALIDEZ TRIBUTARIA/)).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Detalle del pedido #103' })).toBeTruthy()
    expect(screen.getByText(/Cliente Prueba/)).toBeTruthy()
    expect(screen.getByText(/prueba@pawpets.cl/)).toBeTruthy()
    expect(screen.getByText(/Hueso de goma/)).toBeTruthy()
    expect(screen.getByTestId('total-compra').textContent).toContain('$7.000')
    expect(screen.getByRole('button', { name: 'Imprimir comprobante' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Volver a reportes' }).getAttribute('href')).toBe('/admin/reportes')
  })
})
