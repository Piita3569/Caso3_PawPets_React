import { Link } from 'react-router-dom'

function NavegacionTienda() {
  return (
    <nav className="container py-3 d-flex flex-wrap gap-3" aria-label="Secciones de la tienda">
      <Link to="/productos">Catálogo</Link>
      <Link to="/categorias">Categorías</Link>
      <Link to="/ofertas">Ofertas</Link>
      <Link to="/carrito">Carrito</Link>
    </nav>
  )
}

export default NavegacionTienda
