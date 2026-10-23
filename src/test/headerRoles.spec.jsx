/* global describe, it, expect, afterEach */
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../componentes/Header.jsx'

describe('Navegación del Header según el rol', () => {
  afterEach(() => cleanup())

  const rutasAdmin = [
    '/admin/productos',
    '/admin/categorias',
    '/admin/usuarios',
    '/admin/reportes'
  ]

  function mostrarMenu(usuario = null) {
    render(
      <MemoryRouter>
        <Header usuario={usuario} cantidadCarrito={2} />
      </MemoryRouter>
    )
  }

  function obtenerEnlace(ruta) {
    return screen.queryAllByRole('link').find(
      enlace => enlace.getAttribute('href') === ruta
    )
  }

  function verificarSinAccesosAdmin() {
    for (const ruta of rutasAdmin) {
      expect(obtenerEnlace(ruta)).toBeUndefined()
    }
  }

  it('muestra Ingresar al visitante y oculta los accesos privados', () => {
    mostrarMenu()
    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Vendedor' })).toBeNull()
    verificarSinAccesosAdmin()
  })

  it('oculta los accesos privados al cliente', () => {
    mostrarMenu({ rol: 'cliente' })
    expect(screen.queryByRole('link', { name: 'Ingresar' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Vendedor' })).toBeNull()
    verificarSinAccesosAdmin()
  })

  it('muestra solamente su panel privado al vendedor', () => {
    mostrarMenu({ rol: 'vendedor' })
    expect(screen.getByRole('link', { name: 'Vendedor' })).toBeTruthy()
    verificarSinAccesosAdmin()
  })

  it('muestra los cuatro accesos administrativos al administrador', () => {
    mostrarMenu({ rol: 'administrador' })

    for (const ruta of rutasAdmin) {
      expect(obtenerEnlace(ruta)).toBeTruthy()
    }

    expect(screen.queryByRole('link', { name: 'Vendedor' })).toBeNull()
  })

  it('mantiene el catálogo y el carrito para todos', () => {
    mostrarMenu()
    expect(obtenerEnlace('/productos')).toBeTruthy()
    expect(screen.getByRole('link', { name: /Carrito 2/ })).toBeTruthy()
  })
})
