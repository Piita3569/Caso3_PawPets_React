import { useState } from 'react'

function FormularioCategoria({ categoriaInicial = null, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(categoriaInicial?.nombre ?? '')
  const [error, setError] = useState('')

  function guardar(evento) {
    evento.preventDefault()
    setError('')

    try {
      onGuardar({ nombre })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={guardar} className="card p-4 mb-4">
      <h2 className="h4">
        {categoriaInicial ? 'Editar categoria' : 'Nueva categoria'}
      </h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label" htmlFor="categoria-nombre">
          Nombre de la categoria
        </label>
        <input
          id="categoria-nombre"
          className="form-control"
          type="text"
          value={nombre}
          onChange={evento => setNombre(evento.target.value)}
          required
        />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-success" type="submit">
          Guardar categoria
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={onCancelar}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default FormularioCategoria
