import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './componentes/Header.jsx'
import Footer from './componentes/Footer.jsx'
import Inicio from './paginas/Inicio.jsx'
import Nosotros from './paginas/Nosotros.jsx'
import Blog from './paginas/Blog.jsx'
import BlogCalor from './paginas/BlogCalor.jsx'
import BlogVacunas from './paginas/BlogVacunas.jsx'
import AdminProductos from './paginas/AdminProductos.jsx'
import AdminCategorias from './paginas/AdminCategorias.jsx'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="contenido-principal">
        <Routes>
          <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/calor" element={<BlogCalor />} />
            <Route path="/blog/vacunas" element={<BlogVacunas />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/categorias" element={<AdminCategorias />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default App
