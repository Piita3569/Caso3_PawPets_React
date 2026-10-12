import { UMBRAL_STOCK_CRITICO } from '../datos/categorias.js'

export function obtenerEstadoStock(stock) {
  if (stock === 0) return 'Agotado'
  if (stock <= UMBRAL_STOCK_CRITICO) return 'Critico'
  return 'Normal'
}

export function listarProductosStockCritico(productos) {
  return productos.filter(
    producto => producto.stock <= UMBRAL_STOCK_CRITICO
  )
}

export function contarProductosStockCritico(productos) {
  return listarProductosStockCritico(productos).length
}
