import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  buscarProducto
} from '../servicios/productos.js'

describe('CRUD de productos PawPets', () => {
  let almacenamientoOriginal
  let memoria

  beforeEach(() => {
    almacenamientoOriginal = globalThis.localStorage
    memoria = new Map()

    globalThis.localStorage = {
      getItem: clave => memoria.get(clave) ?? null,
      setItem: (clave, valor) => memoria.set(clave, valor)
    }
  })

  afterEach(() => {
    globalThis.localStorage = almacenamientoOriginal
  })

  it('debe crear un producto correctamente', () => {
    const producto = crearProducto({
      nombre: 'Producto de prueba',
      descripcion: 'Prueba Jasmine',
      precio: 5000,
      stock: 10,
      categoriaId: 4,
      imagen: '',
      oferta: false
    })

    expect(producto.nombre).toBe('Producto de prueba')
    expect(buscarProducto(producto.id)).not.toBeNull()
  })

  it('debe actualizar un producto correctamente', () => {
    const producto = actualizarProducto(1, {
      precio: 29990,
      stock: 12
    })

    expect(producto.precio).toBe(29990)
    expect(buscarProducto(1).stock).toBe(12)
  })

  it('debe eliminar un producto correctamente', () => {
    const eliminado = eliminarProducto(1)

    expect(eliminado).toBeTrue()
    expect(buscarProducto(1)).toBeNull()
  })
})
