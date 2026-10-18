import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './componentes/Header.jsx'
import Footer from './componentes/Footer.jsx'
import Inicio from './paginas/Inicio.jsx'
import AdminProductos from './paginas/AdminProductos.jsx'
import AdminCategorias from './paginas/AdminCategorias.jsx'
import productos from './datos/productos.json'
import categorias from './datos/categorias.json'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="contenido-principal">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/admin/productos" element={<AdminProductos productos={productos} categorias={categorias} />} />
          <Route path="/admin/categorias" element={<AdminCategorias categorias={categorias} productos={productos} />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default App
