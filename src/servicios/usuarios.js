import { usuariosIniciales } from '../datos/usuarios.js'

// Copia en memoria para simular persistencia
let usuarios = [...usuariosIniciales]

export function listarUsuarios() {
  return [...usuarios]
} // fin listarUsuarios

export function buscarUsuario(id) {
  return usuarios.find(usuario => usuario.id === Number(id)) ?? null
} // fin buscarUsuario

export function buscarUsuarioPorEmail(email) {
  return usuarios.find(
    usuario => usuario.email.toLowerCase() === email.toLowerCase()
  ) ?? null
} // fin buscarUsuarioPorEmail

export function crearUsuario(datosUsuario) {
  const nombre = String(datosUsuario.nombre ?? '').trim()
  const email = String(datosUsuario.email ?? '').trim()

  if (!nombre) throw new Error('El nombre es obligatorio.')
  if (!email) throw new Error('El correo es obligatorio.')

  const duplicado = usuarios.some(
    usuario => usuario.email.toLowerCase() === email.toLowerCase()
  )

  if (duplicado) throw new Error('Ya existe un usuario con ese correo.')

  const nuevoId = Math.max(0, ...usuarios.map(u => u.id)) + 1
  const nuevoUsuario = {
    ...datosUsuario,
    id: nuevoId,
    nombre,
    email,
    rol: datosUsuario.rol ?? 'cliente'
  }

  usuarios.push(nuevoUsuario)
  return nuevoUsuario
} // fin crearUsuario

export function actualizarUsuario(id, datosActualizados) {
  const indice = usuarios.findIndex(usuario => usuario.id === Number(id))

  if (indice === -1) throw new Error('El usuario no existe.')

  usuarios[indice] = {
    ...usuarios[indice],
    ...datosActualizados,
    id: usuarios[indice].id
  }

  return usuarios[indice]
} // fin actualizarUsuario

export function eliminarUsuario(id) {
  const indice = usuarios.findIndex(usuario => usuario.id === Number(id))

  if (indice === -1) throw new Error('El usuario no existe.')

  usuarios.splice(indice, 1)
  return true
} // fin eliminarUsuario