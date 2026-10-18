// Catálogo compartido desde JSON y carrito en memoria mediante estado React.
import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import Header from './componentes/Header.jsx'
import Footer from './componentes/Footer.jsx'
import Inicio from './paginas/Inicio.jsx'
import AdminProductos from './paginas/AdminProductos.jsx'
import AdminCategorias from './paginas/AdminCategorias.jsx'
import Catalogo from './paginas/Catalogo.jsx'
import DetalleProducto from './paginas/DetalleProducto.jsx'
import Categorias from './paginas/Categorias.jsx'
import Ofertas from './paginas/Ofertas.jsx'
import Carrito from './paginas/Carrito.jsx'
import Checkout from './paginas/Checkout.jsx'
import ResultadoCompra from './paginas/ResultadoCompra.jsx'
import NavegacionTienda from './componentes/NavegacionTienda.jsx'
import productos from './datos/productos.json'
import categorias from './datos/categorias.json'
import { agregarAlCarrito, cambiarCantidad, quitarDelCarrito } from './servicios/carrito.js'
import { confirmarCompra } from './servicios/compras.js'
import './estilos/tienda.css'

function ContenidoApp({ usuario }) {
  const [carrito, setCarrito] = useState([])
  const [ultimoPedido, setUltimoPedido] = useState(null)
  const location = useLocation()

  function agregar(id) {
    const producto = productos.find(producto => producto.id === id)
    if (!producto) throw new Error('El producto ya no está disponible.')
    setCarrito(agregarAlCarrito(carrito, producto))
  }

  function cambiar(id, cantidad) {
    const producto = productos.find(producto => producto.id === id)
    if (!producto) throw new Error('El producto ya no está disponible. Elimínalo del carrito.')
    setCarrito(cambiarCantidad(carrito, producto, cantidad))
  }

  function comprar(cliente, usuarioId) {
    const pedido = confirmarCompra(carrito, cliente, productos, usuarioId)
    setUltimoPedido(pedido)
    setCarrito([])
    return pedido
  }

  const cantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0)

  return (
    <>
      <Header cantidadCarrito={cantidadCarrito} />
      <NavegacionTienda />
      <div className="contenido-principal">
        <Routes location={location}>
          <Route path="/" element={<Inicio productos={productos} />} />
          <Route path="/admin/productos" element={<AdminProductos productos={productos} categorias={categorias} />} />
          <Route path="/admin/categorias" element={<AdminCategorias categorias={categorias} productos={productos} />} />
          <Route path="/productos" element={<Catalogo productos={productos} onAgregar={agregar} />} />
          <Route path="/productos/:id" element={<DetalleProducto key={location.pathname} productos={productos} onAgregar={agregar} />} />
          <Route path="/categorias" element={<Categorias productos={productos} categorias={categorias} onAgregar={agregar} />} />
          <Route path="/categorias/:id" element={<Categorias productos={productos} categorias={categorias} onAgregar={agregar} />} />
          <Route path="/ofertas" element={<Ofertas productos={productos} onAgregar={agregar} />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} productos={productos} onCambiarCantidad={cambiar}
            onEliminar={id => setCarrito(quitarDelCarrito(carrito, id))} onVaciar={() => setCarrito([])} />} />
          <Route path="/checkout" element={<Checkout carrito={carrito} productos={productos} onConfirmar={comprar} usuario={usuario} />} />
          <Route path="/compra/exito/:id" element={<ResultadoCompra pedido={ultimoPedido} />} />
          <Route path="/compra/error" element={<ResultadoCompra fallido />} />
          <Route path="*" element={<main className="container py-4"><h1>Vista no disponible</h1>
            <p>Esta dirección no tiene una página integrada todavía.</p><Link to="/productos">Ir a la tienda</Link></main>} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

// El módulo de usuarios puede entregar el usuario por props cuando se integre.
function App({ usuario = null }) {
  return <BrowserRouter><ContenidoApp usuario={usuario} /></BrowserRouter>
}

export default App
