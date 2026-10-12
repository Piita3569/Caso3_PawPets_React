import { useState } from 'react'
import { listarProductos, crearProducto, actualizarProducto, eliminarProducto } from '../servicios/productos.js'
import FormularioProducto from '../componentes/FormularioProducto.jsx'
import { listarCategorias } from '../servicios/categorias.js'
import { obtenerEstadoStock, contarProductosStockCritico } from '../servicios/stock.js'

function AdminProductos() {
  const [productos, setProductos] = useState(() => listarProductos())
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [categorias] = useState(() => listarCategorias())

  const nombreCategoria = (id) =>
    categorias.find(categoria => categoria.id === id)?.nombre ?? 'Sin categoria'

  function guardarProducto(datos) {
    if (productoSeleccionado) {
      actualizarProducto(productoSeleccionado.id, datos)
    } else {
      crearProducto(datos)
    }
    setProductos(listarProductos())
    cancelarFormulario()
  }

  function editarProducto(producto) {
    setProductoSeleccionado(producto)
    setMostrarFormulario(true)
  }

  function cancelarFormulario() {
    setMostrarFormulario(false)
    setProductoSeleccionado(null)
  }

  function confirmarEliminacion(producto) {
    const confirmado = window.confirm(
      '¿Estas seguro de eliminar el producto "' + producto.nombre + '"?'
    )

    if (!confirmado) return

    eliminarProducto(producto.id)
    setProductos(listarProductos())

    if (productoSeleccionado?.id === producto.id) {
      cancelarFormulario()
    }
  }

  const cantidadStockCritico = contarProductosStockCritico(productos)

  return (
    <main className="container py-5">
      <h1>Administracion de productos</h1>
      <p>Consulta y gestion del inventario de PawPets.</p>

        <div className={cantidadStockCritico > 0 ? 'alert alert-warning' : 'alert alert-success'} role="status">
          Productos con stock critico o agotado: <strong>{cantidadStockCritico}</strong>
        </div>

      <button
        type="button"
        className="btn btn-success mb-4"
        onClick={() => {
          setProductoSeleccionado(null)
          setMostrarFormulario(true)
        }}
      >
        Nuevo producto
      </button>

      {mostrarFormulario && (
        <FormularioProducto
          key={productoSeleccionado?.id ?? 'nuevo'}
          productoInicial={productoSeleccionado}
          categorias={categorias}
          onGuardar={guardarProducto}
          onCancelar={cancelarFormulario}
        />
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-success">
            <tr>
              <th>Codigo</th>
              <th>Producto</th>
              <th>Categoria</th>
              <th>Precio</th>
              <th>Stock</th>
                <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{nombreCategoria(producto.categoriaId)}</td>
                <td>${producto.precio.toLocaleString('es-CL')}</td>
                <td>{producto.stock}</td>
                  <td>
                    <span className={
                      obtenerEstadoStock(producto.stock) === 'Agotado'
                        ? 'badge text-bg-danger'
                        : obtenerEstadoStock(producto.stock) === 'Critico'
                          ? 'badge text-bg-warning'
                          : 'badge text-bg-success'
                    }>
                      {obtenerEstadoStock(producto.stock)}
                    </span>
                  </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={() => editarProducto(producto)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => confirmarEliminacion(producto)}
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

export default AdminProductos
