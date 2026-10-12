import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../estilos/header.css'

function Header({ cantidadCarrito = 0 }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg" aria-label="Navegación principal">
        <div className="container">
          <NavLink className="brand navbar-brand" to="/" onClick={cerrarMenu}>
            🐾 <span>PawPets</span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            aria-label="Abrir o cerrar menú"
            aria-expanded={menuAbierto}
            aria-controls="menu-pawpets"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            id="menu-pawpets"
            className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`}
          >
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <NavLink className="nav-link" to="/" end onClick={cerrarMenu}>Inicio</NavLink>
              <NavLink className="nav-link" to="/productos" onClick={cerrarMenu}>Productos</NavLink>
              <NavLink className="nav-link" to="/nosotros" onClick={cerrarMenu}>Nosotros</NavLink>
              <NavLink className="nav-link" to="/blog" onClick={cerrarMenu}>Blog</NavLink>
              <NavLink className="nav-link" to="/contacto" onClick={cerrarMenu}>Contacto</NavLink>
              <NavLink className="nav-link" to="/vendedor" onClick={cerrarMenu}>Vendedor</NavLink>
              <NavLink className="nav-link" to="/admin/productos" onClick={cerrarMenu}>Administrador</NavLink>
              <NavLink className="nav-link" to="/login" onClick={cerrarMenu}>Ingresar</NavLink>
              <NavLink className="cart-button" to="/carrito" onClick={cerrarMenu}>
                🛒 Carrito <b>{cantidadCarrito}</b>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
