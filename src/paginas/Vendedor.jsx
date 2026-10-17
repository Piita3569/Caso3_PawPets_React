import { obtenerSesion, cerrarSesion } from '../servicios/sesion.js'
import { useNavigate } from 'react-router-dom'

function Vendedor() {
  const sesion = obtenerSesion()
  const navigate = useNavigate()

  function handleCerrarSesion() {
    cerrarSesion()
    navigate('/login')
  } // fin handleCerrarSesion

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Panel Vendedor</h1>
          {sesion && (
            <p className="text-muted">Bienvenido, {sesion.nombre}</p>
          )}
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={handleCerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card p-4 h-100">
            <h3>Inventario</h3>
            <p>Consulta los productos disponibles en la tienda.</p>
          </div>
        </div>
        {/* fin card inventario */}

        <div className="col-12 col-md-4">
          <div className="card p-4 h-100">
            <h3>Mis clientes</h3>
            <p>Listado de clientes asignados.</p>
          </div>
        </div>
        {/* fin card clientes */}

        <div className="col-12 col-md-4">
          <div className="card p-4 h-100">
            <h3>Mis ventas</h3>
            <p>Historial de ventas realizadas.</p>
          </div>
        </div>
        {/* fin card ventas */}
      </div>
    </main>
  )
} // fin Vendedor

export default Vendedor