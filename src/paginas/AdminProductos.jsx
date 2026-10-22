import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerEstadoStock, listarProductosStockCritico, UMBRAL_STOCK_CRITICO } from '../servicios/stock.js'

function AdminProductos({ productos = [], categorias = [], onCrear, onEditar, onEliminar }) {
  const [soloCriticos, setSoloCriticos] = useState(false)
  const [productoSeleccionadoId, setProductoSeleccionado] = useState(null)
  const productoSeleccionado = productos.find(producto => producto.id === productoSeleccionadoId) ?? null
  const [productoEditando, setProductoEditando] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoriaId: '',
    stock: '',
    oferta: false
  })
  const criticos = listarProductosStockCritico(productos)
  const productosVisibles = soloCriticos ? criticos : productos

  function nombreCategoria(id) {
    return categorias.find(categoria => categoria.id === id)?.nombre ?? 'Sin categoría'
  }

  function abrirNuevoProducto() {
    setProductoEditando(null)
    setFormulario({
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      categoriaId: '',
      stock: '',
      oferta: false
    })
    setMensaje('')
    setError('')
    setMostrarFormulario(true)
  }

  function comenzarEdicion(producto) {
    setProductoEditando(producto.id)
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      imagen: producto.imagen,
      categoriaId: String(producto.categoriaId),
      stock: String(producto.stock),
      oferta: producto.oferta
    })
    setMensaje('')
    setError('')
    setMostrarFormulario(true)
  }

  function guardarProducto(evento) {
    evento.preventDefault()
    setMensaje('')
    setError('')

    const datos = {
      ...formulario,
      precio: Number(formulario.precio),
      categoriaId: Number(formulario.categoriaId),
      stock: Number(formulario.stock)
    }

    try {
      if (productoEditando !== null) {
        onEditar(productoEditando, datos)
        setMensaje('Producto actualizado correctamente.')
      } else {
        onCrear(datos)
        setMensaje('Producto creado correctamente.')
      }

      setMostrarFormulario(false)
      setProductoEditando(null)
    } catch (err) {
      setError(err.message)
    }
  }

  function confirmarEliminacion(producto) {
    if (!window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return
    setError("")
    setMensaje("")
    try {
      onEliminar(producto.id)
      setProductoSeleccionado(null)
      setMensaje("Producto eliminado correctamente.")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="container py-5">
      <h1>Administración de productos</h1>
      <p>Consulta del catálogo de PawPets.</p>
      <Link className="btn btn-outline-success mb-4" to="/admin/categorias">Consultar categorías</Link>

        {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <button className="btn btn-success mb-4" type="button" onClick={abrirNuevoProducto}>Nuevo producto</button>
        {mostrarFormulario && (
          <section className="card p-4 mb-4" aria-label="Formulario administrativo de producto">
            <h2 className="h5">{productoEditando !== null ? "Editar producto" : "Crear producto"}</h2>
            <form onSubmit={guardarProducto}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="producto-nombre">Nombre del producto</label>
                  <input id="producto-nombre" className="form-control" type="text" required maxLength={120}
                    value={formulario.nombre}
                    onChange={e => setFormulario({ ...formulario, nombre: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="producto-categoria">Categoría</label>
                  <select id="producto-categoria" className="form-select" required
                    value={formulario.categoriaId}
                    onChange={e => setFormulario({ ...formulario, categoriaId: e.target.value })}>
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="producto-descripcion">Descripción</label>
                  <textarea id="producto-descripcion" className="form-control" rows={3} required
                    value={formulario.descripcion}
                    onChange={e => setFormulario({ ...formulario, descripcion: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="producto-precio">Precio ($ CLP)</label>
                  <input id="producto-precio" className="form-control" type="number" min="1" step="1" required
                    value={formulario.precio}
                    onChange={e => setFormulario({ ...formulario, precio: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="producto-stock">Stock disponible</label>
                  <input id="producto-stock" className="form-control" type="number" min="0" step="1" required
                    value={formulario.stock}
                    onChange={e => setFormulario({ ...formulario, stock: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="producto-imagen">URL de imagen (opcional)</label>
                  <input id="producto-imagen" className="form-control" type="url"
                    value={formulario.imagen}
                    onChange={e => setFormulario({ ...formulario, imagen: e.target.value })} />
                </div>
                <div className="form-check mb-3">
                  <input id="producto-oferta" className="form-check-input" type="checkbox"
                    checked={formulario.oferta}
                    onChange={e => setFormulario({ ...formulario, oferta: e.target.checked })} />
                  <label className="form-check-label" htmlFor="producto-oferta">Producto en oferta</label>
                </div>
                <div className="mt-4">
                  <button className="btn btn-success me-2" type="submit">
                    {productoEditando !== null ? "Guardar cambios" : "Crear producto"}
                  </button>
                  <button className="btn btn-outline-secondary" type="button"
                    onClick={() => { setMostrarFormulario(false); setError(""); setProductoEditando(null) }}>
                    Cancelar
                  </button>
                </div>
            </form>
          </section>
        )}
      <div className={criticos.length > 0 ? 'alert alert-warning' : 'alert alert-success'} role="status">
        Productos con stock crítico o agotado: <strong>{criticos.length}</strong>
      </div>

      <div className="form-check mb-4">
        <input className="form-check-input" id="solo-criticos" type="checkbox" checked={soloCriticos}
          onChange={evento => setSoloCriticos(evento.target.checked)} />
        <label className="form-check-label" htmlFor="solo-criticos">Mostrar solo productos con stock crítico o agotado</label>
      </div>

      {productoSeleccionado && (
        <section className="card p-4 mb-4" aria-label="Detalle administrativo del producto">
          <h2 className="h4">{productoSeleccionado.nombre}</h2>
          <p>{productoSeleccionado.descripcion}</p>
          <p>Categoría: {nombreCategoria(productoSeleccionado.categoriaId)}</p>
          <p>Precio: ${productoSeleccionado.precio.toLocaleString('es-CL')}</p>
          <p>Stock: {productoSeleccionado.stock}</p>
          <p>Oferta: {productoSeleccionado.oferta ? 'Sí' : 'No'}</p>
          <button className="btn btn-outline-secondary align-self-start" type="button"
            onClick={() => setProductoSeleccionado(null)}>Cerrar detalle</button>
        </section>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <caption>Productos del catálogo de PawPets</caption>
          <thead className="table-success">
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Stock</th>
              <th scope="col">Estado</th>
              <th scope="col">Detalle</th>
                <th scope="col">Editar</th>
                <th scope="col">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productosVisibles.map(producto => (
              <tr key={producto.id}>
                <th scope="row">{producto.id}</th>
                <td>{producto.nombre}</td>
                <td>{nombreCategoria(producto.categoriaId)}</td>
                <td>${producto.precio.toLocaleString('es-CL')}</td>
                <td>{producto.stock}</td>
                <td>
                  <span className={producto.stock === 0 ? 'badge text-bg-danger'
                    : producto.stock <= UMBRAL_STOCK_CRITICO ? 'badge text-bg-warning' : 'badge text-bg-success'}>
                    {obtenerEstadoStock(producto.stock)}
                  </span>
                </td>
                <td><button className="btn btn-outline-success btn-sm" type="button"
                  aria-label={'Ver detalle de ' + producto.nombre}
                  onClick={() => setProductoSeleccionado(producto.id)}>Ver detalle</button></td>
                  <td><button className="btn btn-outline-primary btn-sm" type="button"
                    onClick={() => comenzarEdicion(producto)}>Editar</button></td>
                  <td><button className="btn btn-outline-danger btn-sm" type="button"
                    aria-label={"Eliminar " + producto.nombre}
                    onClick={() => confirmarEliminacion(producto)}>Eliminar</button></td>
              </tr>
            ))}
            {productosVisibles.length === 0 && (
              <tr><td colSpan="9">{soloCriticos ? 'No hay productos con stock crítico o agotado.' : 'No hay productos para mostrar.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default AdminProductos
