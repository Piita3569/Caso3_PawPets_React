import { useState } from 'react'

function FormularioProducto({ productoInicial = null, categorias = [], onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState({
    nombre: productoInicial?.nombre ?? '',
    descripcion: productoInicial?.descripcion ?? '',
    precio: productoInicial?.precio ?? '',
    stock: productoInicial?.stock ?? '',
    categoriaId: productoInicial?.categoriaId ?? '',
    imagen: productoInicial?.imagen ?? '',
    oferta: productoInicial?.oferta ?? false
  })
  const [error, setError] = useState('')

  function cambiarCampo(evento) {
    const { name, value, type, checked } = evento.target
    setFormulario(anterior => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function guardar(evento) {
    evento.preventDefault()
    setError('')

    try {
      onGuardar(formulario)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={guardar} className="card p-4 mb-4">
      <h2 className="h4">{productoInicial ? 'Editar producto' : 'Nuevo producto'}</h2>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="producto-nombre">Nombre</label>
          <input id="producto-nombre" className="form-control" name="nombre"
            value={formulario.nombre} onChange={cambiarCampo} required />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="producto-categoria">Categoria</label>
          <select id="producto-categoria" className="form-select" name="categoriaId"
            value={formulario.categoriaId} onChange={cambiarCampo} required>
            <option value="">Seleccionar categoria</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="producto-precio">Precio</label>
          <input id="producto-precio" className="form-control" type="number" min="1"
            name="precio" value={formulario.precio} onChange={cambiarCampo} required />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="producto-stock">Stock</label>
          <input id="producto-stock" className="form-control" type="number" min="0" step="1"
            name="stock" value={formulario.stock} onChange={cambiarCampo} required />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="producto-descripcion">Descripcion</label>
          <textarea id="producto-descripcion" className="form-control" name="descripcion"
            value={formulario.descripcion} onChange={cambiarCampo} rows="2" />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="producto-imagen">URL de imagen</label>
          <input id="producto-imagen" className="form-control" name="imagen"
            value={formulario.imagen} onChange={cambiarCampo} />
        </div>
        <div className="col-12">
          <label className="form-check-label">
            <input className="form-check-input me-2" type="checkbox" name="oferta"
              checked={formulario.oferta} onChange={cambiarCampo} />
            Producto en oferta
          </label>
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button className="btn btn-success" type="submit">Guardar producto</button>
        <button className="btn btn-outline-secondary" type="button" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default FormularioProducto
