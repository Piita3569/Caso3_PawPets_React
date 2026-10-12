import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './componentes/Header.jsx'
import Footer from './componentes/Footer.jsx'
import Inicio from './paginas/Inicio.jsx'
import AdminProductos from './paginas/AdminProductos.jsx'
import AdminCategorias from './paginas/AdminCategorias.jsx'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="contenido-principal">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/categorias" element={<AdminCategorias />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default App
