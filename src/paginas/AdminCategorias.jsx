import { useState } from 'react'
import { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from '../servicios/categorias.js'
import FormularioCategoria from '../componentes/FormularioCategoria.jsx'

function AdminCategorias() {
  const [categorias, setCategorias] = useState(() => listarCategorias())
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [errorEliminacion, setErrorEliminacion] = useState('')

  function guardarCategoria(datos) {
    if (categoriaSeleccionada) {
      actualizarCategoria(categoriaSeleccionada.id, datos)
    } else {
      crearCategoria(datos)
    }
    setCategorias(listarCategorias())
    cancelarFormulario()
  }

  function editarCategoria(categoria) {
    setCategoriaSeleccionada(categoria)
    setMostrarFormulario(true)
  }

  function cancelarFormulario() {
    setMostrarFormulario(false)
    setCategoriaSeleccionada(null)
  }

  function confirmarEliminacion(categoria) {
    setErrorEliminacion('')

    const confirmado = window.confirm(
      '¿Estas seguro de eliminar la categoria "' + categoria.nombre + '"?'
    )

    if (!confirmado) return

    try {
      eliminarCategoria(categoria.id)
      setCategorias(listarCategorias())

      if (categoriaSeleccionada?.id === categoria.id) {
        cancelarFormulario()
      }
    } catch (error) {
      setErrorEliminacion(error.message)
    }
  }

  return (
    <main className="container py-5">
      <h1>Administracion de categorias</h1>
      <p>Consulta y gestion de categorias de PawPets.</p>

        {errorEliminacion && (
          <div className="alert alert-danger" role="alert">
            {errorEliminacion}
          </div>
        )}

      <button
        type="button"
        className="btn btn-success mb-4"
        onClick={() => {
          setCategoriaSeleccionada(null)
          setMostrarFormulario(true)
        }}
      >
        Nueva categoria
      </button>

      {mostrarFormulario && (
        <FormularioCategoria
          key={categoriaSeleccionada?.id ?? 'nueva'}
          categoriaInicial={categoriaSeleccionada}
          onGuardar={guardarCategoria}
          onCancelar={cancelarFormulario}
        />
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-success">
            <tr>
              <th>Codigo</th>
              <th>Categoria</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nombre}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={() => editarCategoria(categoria)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => confirmarEliminacion(categoria)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default AdminCategorias
