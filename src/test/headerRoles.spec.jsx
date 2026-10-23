import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../componentes/Header.jsx'

// Revisa los enlaces del menú para cada tipo de usuario.
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

  // Datos: Visitante sin sesión.
  // Acción: Mostrar el menú principal.
  // Resultado esperado: Aparece Ingresar; no aparecen Vendedor ni los cuatro enlaces de administración.
  it('muestra Ingresar al visitante y oculta los accesos privados', () => {
    mostrarMenu()
    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Vendedor' })).toBeNull()
    verificarSinAccesosAdmin()
  })

  // Datos: Usuario con rol cliente.
  // Acción: Mostrar el menú principal.
  // Resultado esperado: No aparecen Ingresar, Vendedor ni los cuatro enlaces de administración.
  it('oculta los accesos privados al cliente', () => {
    mostrarMenu({ rol: 'cliente' })
    expect(screen.queryByRole('link', { name: 'Ingresar' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Vendedor' })).toBeNull()
    verificarSinAccesosAdmin()
  })

  // Datos: Usuario con rol vendedor.
  // Acción: Mostrar el menú principal.
  // Resultado esperado: Aparece Vendedor y no aparecen enlaces de administración.
  it('muestra solamente su panel privado al vendedor', () => {
    mostrarMenu({ rol: 'vendedor' })
    expect(screen.getByRole('link', { name: 'Vendedor' })).toBeTruthy()
    verificarSinAccesosAdmin()
  })

  // Datos: Usuario con rol administrador.
  // Acción: Mostrar el menú principal.
  // Resultado esperado: Aparecen Productos, Categorías, Usuarios y Reportes de administración; no aparece Vendedor.
  it('muestra los cuatro accesos administrativos al administrador', () => {
    mostrarMenu({ rol: 'administrador' })

    for (const ruta of rutasAdmin) {
      expect(obtenerEnlace(ruta)).toBeTruthy()
    }

    expect(screen.queryByRole('link', { name: 'Vendedor' })).toBeNull()
  })

  // Datos: Visitante sin sesión y contador del carrito en 2.
  // Acción: Mostrar el menú principal.
  // Resultado esperado: Aparecen el enlace al catálogo y el carrito con el contador 2.
  it('muestra el catálogo y el contador 2 del carrito al visitante', () => {
    mostrarMenu()
    expect(obtenerEnlace('/productos')).toBeTruthy()
    expect(screen.getByRole('link', { name: /Carrito 2/ })).toBeTruthy()
  })
})
