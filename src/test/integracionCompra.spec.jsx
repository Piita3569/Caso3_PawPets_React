/* global describe, beforeEach, afterEach, it, expect */
import { act } from 'react'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import App from '../App.jsx'
import { crearUsuario, eliminarUsuario } from '../servicios/usuarios.js'
import { iniciarSesion, obtenerSesion } from '../servicios/sesion.js'

describe('Integración de la compra de Andrés con usuarios y sesión', () => {
  let cliente
  let segundoUsuario
  let sesionAnterior
  let entornoActAnterior
  let rutaAnterior

  beforeEach(() => {
    sesionAnterior = sessionStorage.getItem('pawpets_sesion')
    sessionStorage.removeItem('pawpets_sesion')
    entornoActAnterior = globalThis.IS_REACT_ACT_ENVIRONMENT
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    rutaAnterior = window.location.pathname
    cliente = crearUsuario({
      nombre: 'Cliente integración', email: 'integracion@gmail.com', password: '1234', rut: '19011022K',
      direccion: 'Calle Uno 123', region: 'Biobío', comuna: 'Concepción', rol: 'cliente'
    })
    segundoUsuario = crearUsuario({
      nombre: 'Otra persona', email: 'otra.persona@gmail.com', password: '1234', rut: '19011022K',
      direccion: 'Calle Dos 456', region: 'Valparaíso', comuna: 'Villa Alemana', rol: 'vendedor'
    })
  })

  afterEach(() => {
    cleanup()
    eliminarUsuario(cliente.id)
    eliminarUsuario(segundoUsuario.id)
    if (sesionAnterior === null) sessionStorage.removeItem('pawpets_sesion')
    else sessionStorage.setItem('pawpets_sesion', sesionAnterior)
    window.history.replaceState(null, '', rutaAnterior)
    globalThis.IS_REACT_ACT_ENVIRONMENT = entornoActAnterior
  })

  function abrir(ruta, usuario = null) {
    if (usuario) iniciarSesion(usuario)
    window.history.replaceState(null, '', ruta)
    render(<App />)
  }

  async function navegar(ruta, estado = null) {
    await act(async () => {
      window.history.pushState(estado, '', ruta)
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
  }

  function iniciarCompra() {
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])
    continuarCompra()
  }

  function continuarCompra() {
    fireEvent.click(screen.getByRole('link', { name: 'Carrito', exact: true }))
    fireEvent.click(screen.getByRole('link', { name: 'Continuar compra' }))
  }

  function ingresar(usuario) {
    fireEvent.change(screen.getByLabelText('Rol'), { target: { value: usuario.rol } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: usuario.email } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '1234' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
  }

  it('conecta login, carrito y compra con los datos y región del usuario', () => {
    abrir('/login')
    ingresar(cliente)
    iniciarCompra()
    expect(screen.getByLabelText('Nombre completo').value).toBe(cliente.nombre)
    expect(screen.getByLabelText('Dirección y número').value).toBe(cliente.direccion)
    expect(screen.getByLabelText('Región').value).toBe('Biobío')
    expect(screen.getByLabelText('Comuna').value).toBe('Concepción')
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    expect(screen.getByRole('heading', { name: 'Compra realizada con éxito' })).toBeTruthy()
    expect(screen.getByText(/Dirección: Calle Uno 123, Concepción, Biobío/)).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'Carrito', exact: true }))
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy()
  })

  it('usa el perfil actualizado en la sesión y en el checkout sin volver a ingresar', () => {
    abrir('/perfil', cliente)
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Nombre actualizado' } })
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'actualizado@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Región'), { target: { value: 'Metropolitana' } })
    expect(screen.getByLabelText('Comuna').value).toBe('')
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'La Florida' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(obtenerSesion().nombre).toBe('Nombre actualizado')
    iniciarCompra()
    expect(screen.getByLabelText('Nombre completo').value).toBe('Nombre actualizado')
    expect(screen.getByLabelText('Correo electrónico').value).toBe('actualizado@gmail.com')
    expect(screen.getByLabelText('Comuna').value).toBe('La Florida')
    expect(screen.getByLabelText('Dirección y número').value).toBe(cliente.direccion)
  })

  it('al cerrar sesión desde perfil conserva el carrito y permite comprar como invitado', async () => {
    abrir('/productos', cliente)
    iniciarCompra()
    await navegar('/perfil')
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(obtenerSesion()).toBeNull()
    continuarCompra()
    expect(screen.getByLabelText('Nombre completo').value).toBe('')
    expect(screen.getByLabelText('Correo electrónico').value).toBe('')
    expect(screen.getByLabelText('Dirección y número').value).toBe('')
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Invitado' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'invitado@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Opción de entrega'), { target: { value: 'retiro' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    expect(screen.getByRole('heading', { name: 'Compra realizada con éxito' })).toBeTruthy()
    expect(screen.getByText('Cliente: Invitado — invitado@gmail.com')).toBeTruthy()
  })

  it('también elimina del checkout la sesión cerrada desde el panel vendedor', async () => {
    abrir('/productos', segundoUsuario)
    iniciarCompra()
    await navegar('/vendedor')
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    continuarCompra()
    expect(obtenerSesion()).toBeNull()
    expect(screen.getByLabelText('Nombre completo').value).toBe('')
    expect(screen.getByLabelText('Dirección y número').value).toBe('')
  })

  it('al cambiar de cuenta no reutiliza los datos de un reintento del usuario anterior', async () => {
    abrir('/productos', cliente)
    iniciarCompra()
    fireEvent.change(screen.getByLabelText('Resultado del pago de demostración'), { target: { value: 'fallido' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    const estadoReintento = window.history.state
    await navegar('/perfil')
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    ingresar(segundoUsuario)
    await navegar('/compra/error', estadoReintento)
    fireEvent.click(screen.getByRole('link', { name: 'Reintentar pago' }))
    expect(screen.getByLabelText('Nombre completo').value).toBe(segundoUsuario.nombre)
    expect(screen.getByLabelText('Dirección y número').value).toBe(segundoUsuario.direccion)
    expect(screen.getByLabelText('Comuna').value).toBe('Villa Alemana')
  })

  it('al cerrar sesión deja de mostrar el resumen personal de la compra anterior', async () => {
    abrir('/productos', cliente)
    iniciarCompra()
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    const rutaResumen = window.location.pathname
    await navegar('/perfil')
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    await navegar(rutaResumen)
    expect(screen.getByRole('heading', { name: 'Resumen no disponible' })).toBeTruthy()
    expect(screen.queryByText(/Cliente: Cliente integración/)).toBeNull()
  })

  it('refresca el checkout al editar el usuario de la sesión desde administración', () => {
    abrir('/admin/usuarios/' + cliente.id, cliente)
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Nombre editado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))
    expect(obtenerSesion().nombre).toBe('Nombre editado')
    iniciarCompra()
    expect(screen.getByLabelText('Nombre completo').value).toBe('Nombre editado')
  })
})
