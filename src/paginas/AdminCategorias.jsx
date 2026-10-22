import { useState } from 'react'
import { Link } from 'react-router-dom'
import { crearCategoria, editarCategoria, eliminarCategoria } from '../servicios/categorias.js'

function AdminCategorias({ categorias = [], productos = [], onCrear, onEditar, onEliminar }) {
  const [nombre, setNombre] = useState('')
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function guardar(evento) {
    evento.preventDefault()
    setMensaje('')
    setError('')

    try {
      if (categoriaEditando !== null) {
        editarCategoria(categorias, categoriaEditando, nombre)
        onEditar(categoriaEditando, nombre)
        setMensaje('Categoría actualizada correctamente.')
      } else {
        crearCategoria(categorias, nombre)
        onCrear(nombre)
        setMensaje('Categoría creada correctamente.')
      }

      setNombre('')
      setCategoriaEditando(null)
    } catch (err) {
      setError(err.message)
    }
  }

  function comenzarEdicion(categoria) {
    setCategoriaEditando(categoria.id)
    setNombre(categoria.nombre)
    setMensaje('')
    setError('')
  }

  function cancelarEdicion() {
    setCategoriaEditando(null)
    setNombre('')
    setMensaje('')
    setError('')
  }

  function quitar(categoria) {
    setMensaje('')
    setError('')

    try {
      eliminarCategoria(categorias, productos, categoria.id)

      if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
        return
      }

      onEliminar(categoria.id)

      if (categoriaEditando === categoria.id) {
        setCategoriaEditando(null)
        setNombre('')
      }

      setMensaje('Categoría eliminada correctamente.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="container py-5">
      <h1>Administración de categorías</h1>
      <p>Gestión de categorías del catálogo de PawPets.</p>

      <Link className="btn btn-outline-success mb-4" to="/admin/productos">
        Consultar productos
      </Link>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <section className="card p-4 mb-4">
        <h2 className="h5">
          {categoriaEditando !== null ? 'Editar categoría' : 'Nueva categoría'}
        </h2>

        <form onSubmit={guardar}>
          <label className="form-label" htmlFor="nombre-categoria">
            Nombre de la categoría
          </label>

          <input
            id="nombre-categoria"
            className="form-control mb-3"
            type="text"
            value={nombre}
            onChange={evento => setNombre(evento.target.value)}
            maxLength={100}
            required
          />

          <button className="btn btn-success me-2" type="submit">
            {categoriaEditando !== null ? 'Guardar cambios' : 'Crear categoría'}
          </button>

          {categoriaEditando !== null && (
            <button className="btn btn-outline-secondary" type="button" onClick={cancelarEdicion}>
              Cancelar
            </button>
          )}
        </form>
      </section>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <caption>Categorías del catálogo de PawPets</caption>
          <thead className="table-success">
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Categoría</th>
              <th scope="col">Productos</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map(categoria => {
              const cantidad = productos.filter(
                producto => producto.categoriaId === categoria.id
              ).length

              return (
                <tr key={categoria.id}>
                  <th scope="row">{categoria.id}</th>
                  <td>{categoria.nombre}</td>
                  <td>{cantidad}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      type="button"
                      onClick={() => comenzarEdicion(categoria)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      type="button"
                      onClick={() => quitar(categoria)}
                      disabled={cantidad > 0}
                      title={cantidad > 0 ? 'Categoría con productos asociados' : 'Eliminar categoría'}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}

            {categorias.length === 0 && (
              <tr>
                <td colSpan="4">No hay categorías para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default AdminCategorias
