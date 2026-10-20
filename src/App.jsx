// Catálogo compartido desde JSON y carrito en memoria mediante estado React.
import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import Header from './componentes/Header.jsx'
import Footer from './componentes/Footer.jsx'
import Inicio from './paginas/Inicio.jsx'
import Nosotros from './paginas/Nosotros.jsx'
import Blog from './paginas/Blog.jsx'
import BlogCalor from './paginas/BlogCalor.jsx'
import BlogVacunas from './paginas/BlogVacunas.jsx'
import AdminReportes from './paginas/AdminReportes.jsx'
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
import { obtenerSesion } from './servicios/sesion.js'
import Login from './paginas/Login.jsx'
import Registro from './paginas/Registro.jsx'
import Contacto from './paginas/Contacto.jsx'
import Vendedor from './paginas/Vendedor.jsx'
import AdminUsuarios from './paginas/AdminUsuarios.jsx'
import Perfil from './paginas/Perfil.jsx'
import NuevoUsuario from './paginas/NuevoUsuario.jsx'
import EditarUsuario from './paginas/EditarUsuario.jsx'
import './estilos/tienda.css'


function ContenidoApp({ usuario, setUsuario }) {
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

  console.log('usuario en App:', usuario)

  return (
    <>
      <Header cantidadCarrito={cantidadCarrito} />
      <NavegacionTienda />
      <div className="contenido-principal">
        <Routes location={location}>
          <Route path="/" element={<Inicio productos={productos} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/calor" element={<BlogCalor />} />
          <Route path="/blog/vacunas" element={<BlogVacunas />} />
          <Route path="/admin/reportes" element={<AdminReportes productos={productos} />} />
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
          <Route path="/login" element={<Login onLogin={setUsuario} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/vendedor" element={<Vendedor />} />
          <Route path="/admin/usuarios/nuevo" element={<NuevoUsuario />} />
          <Route path="/admin/usuarios/:id" element={<EditarUsuario />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<main className="container py-4"><h1>Vista no disponible</h1>
            <p>Esta dirección no tiene una página integrada todavía.</p><Link to="/productos">Ir a la tienda</Link></main>} />
        </Routes>
      </div>
      <Footer />
    </>
  )
} // fin ContenidoApp

function App() {
  const [usuario, setUsuario] = useState(() => obtenerSesion())
  return (
    <BrowserRouter>
      <ContenidoApp usuario={usuario} setUsuario={setUsuario} />
    </BrowserRouter>
  )
} // fin App

export default App