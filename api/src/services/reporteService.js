const pedidoService = require('./pedidoService');
const productoService = require('./productoService');

function facturacionTotal() {
  return pedidoService.listar().reduce((suma, pedido) => suma + pedido.total, 0);
}

function cantidadPorProducto() {
  const cantidades = {};
  for (const pedido of pedidoService.listar()) {
    for (const { productoId, cantidad } of pedido.items) {
      const { nombre } = productoService.obtenerPorId(productoId);
      cantidades[nombre] = (cantidades[nombre] || 0) + cantidad;
    }
  }
  return cantidades;
}

function masVendido() {
  const entradas = Object.entries(cantidadPorProducto());
  if (entradas.length === 0) return { producto: null, cantidad: 0 };
  const [producto, cantidad] = entradas.reduce((max, actual) => (actual[1] > max[1] ? actual : max));
  return { producto, cantidad };
}

module.exports = { facturacionTotal, cantidadPorProducto, masVendido };
