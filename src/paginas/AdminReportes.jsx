import { listarProductos } from '../servicios/productos.js'
import { contarProductosStockCritico } from '../servicios/stock.js'

const pedidosEjemplo = [
  {
    id: 'PP-001',
    cliente: 'Andrea Pérez',
    vendedor: 'Turno mañana',
    total: 25000,
    estado: 'Pendiente'
  },
  {
    id: 'PP-002',
    cliente: 'Juan Soto',
    vendedor: 'Turno mañana',
    total: 3500,
    estado: 'Entregado'
  },
  {
    id: 'PP-003',
    cliente: 'Camila Rojas',
    vendedor: 'Turno tarde',
    total: 18000,
    estado: 'En preparación'
  }
]

function AdminReportes() {
  const productos = listarProductos()
  const stockBajo = contarProductosStockCritico(productos)

  const ventasDelMes = pedidosEjemplo.reduce(
    (total, pedido) => total + pedido.total,
    0
  )

  const pedidosPendientes = pedidosEjemplo.filter(
    pedido => pedido.estado === 'Pendiente'
  ).length

  const formatoPrecio = valor => `$${valor.toLocaleString('es-CL')}`

  return (
    <main className="container py-5">
      <p className="text-success fw-bold">Administrador</p>
      <h1>Reportes de ventas y seguimiento</h1>
      <p className="text-muted">
        Datos de ejemplo para el seguimiento de ventas.
      </p>

      <div className="row g-3 my-4">
        <div className="col-md-4">
          <article className="bg-white rounded p-4 h-100">
            <h2 className="h5">Ventas del mes</h2>
            <p className="fs-3 fw-bold">{formatoPrecio(ventasDelMes)}</p>
            <p>{pedidosEjemplo.length} pedidos registrados</p>
          </article>
        </div>

        <div className="col-md-4">
          <article className="bg-white rounded p-4 h-100">
            <h2 className="h5">Pedidos pendientes</h2>
            <p className="fs-3 fw-bold">{pedidosPendientes}</p>
            <p>Requiere seguimiento</p>
          </article>
        </div>

        <div className="col-md-4">
          <article className="bg-white rounded p-4 h-100">
            <h2 className="h5">Stock bajo</h2>
            <p className="fs-3 fw-bold">{stockBajo}</p>
            <p>Revisar reposición</p>
          </article>
        </div>
      </div>

      <h2 className="h4 mb-3">Seguimiento de ventas</h2>

      <div className="table-responsive">
        <table className="table table-bordered bg-white">
          <thead className="table-success">
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidosEjemplo.map(pedido => (
              <tr key={pedido.id}>
                <td>#{pedido.id}</td>
                <td>{pedido.cliente}</td>
                <td>{pedido.vendedor}</td>
                <td>{formatoPrecio(pedido.total)}</td>
                <td>{pedido.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default AdminReportes
