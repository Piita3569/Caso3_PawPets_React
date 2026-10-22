/* global describe, it, expect, afterEach */
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RutaProtegida from '../componentes/RutaProtegida.jsx'

describe('Protección de rutas por roles', () => {
  afterEach(() => cleanup())

  function probarAcceso(ruta, usuario) {
    render(
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/login" element={<h1>Inicio de sesión</h1>} />
          <Route path="/" element={<h1>Inicio de tienda</h1>} />
          <Route element={<RutaProtegida usuario={usuario} rolPermitido="administrador" />}>
            <Route path="/admin/productos" element={<h1>Panel administrador</h1>} />
          </Route>
          <Route element={<RutaProtegida usuario={usuario} rolPermitido="vendedor" />}>
            <Route path="/vendedor" element={<h1>Panel vendedor</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
  }

  it('redirige al login cuando no existe una sesión', () => {
    probarAcceso('/admin/productos', null)
    expect(screen.getByText('Inicio de sesión')).toBeTruthy()
  })

  it('permite al administrador ingresar a administración', () => {
    probarAcceso('/admin/productos', { rol: 'administrador' })
    expect(screen.getByText('Panel administrador')).toBeTruthy()
  })

  it('impide que un cliente ingrese a administración', () => {
    probarAcceso('/admin/productos', { rol: 'cliente' })
    expect(screen.getByText('Inicio de tienda')).toBeTruthy()
  })

  it('permite al vendedor ingresar a su panel', () => {
    probarAcceso('/vendedor', { rol: 'vendedor' })
    expect(screen.getByText('Panel vendedor')).toBeTruthy()
  })

  it('impide que un vendedor ingrese a administración', () => {
    probarAcceso('/admin/productos', { rol: 'vendedor' })
    expect(screen.getByText('Panel vendedor')).toBeTruthy()
  })

  it('impide que un administrador ingrese al panel vendedor', () => {
    probarAcceso('/vendedor', { rol: 'administrador' })
    expect(screen.getByText('Panel administrador')).toBeTruthy()
  })
})
