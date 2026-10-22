/* global describe, it, expect, afterEach */
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../componentes/Header.jsx'

describe('Navegación del Header según el rol', () => {
  afterEach(() => cleanup())

  function mostrarMenu(usuario = null) {
    render(
      <MemoryRouter>
        <Header usuario={usuario} cantidadCarrito={2} />
      </MemoryRouter>
    )
  }

  it('muestra Ingresar al visitante y oculta los accesos privados', () => {
    mostrarMenu()
    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Administrador' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Vendedor' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Reportes' })).toBeNull()
  })

  it('oculta los accesos privados al cliente', () => {
    mostrarMenu({ rol: 'cliente' })
    expect(screen.queryByRole('link', { name: 'Ingresar' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Administrador' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Vendedor' })).toBeNull()
  })

  it('muestra solamente su panel privado al vendedor', () => {
    mostrarMenu({ rol: 'vendedor' })
    expect(screen.getByRole('link', { name: 'Vendedor' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Administrador' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Reportes' })).toBeNull()
  })

  it('muestra Administrador y Reportes al administrador', () => {
    mostrarMenu({ rol: 'administrador' })
    expect(screen.getByRole('link', { name: 'Administrador' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Reportes' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Vendedor' })).toBeNull()
  })

  it('mantiene el catálogo y el carrito para todos', () => {
    mostrarMenu()
    expect(screen.getByRole('link', { name: 'Productos' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Carrito 2/ })).toBeTruthy()
  })
})
