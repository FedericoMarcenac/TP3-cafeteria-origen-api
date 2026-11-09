const productoService = require('./productoService');
const { ErrorApi } = require('../errors');

const ESTADOS = ['pendiente', 'en_preparacion', 'entregado'];

let pedidos = [];
let siguienteId = 1;

function validarItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ErrorApi(400, 'El pedido debe tener al menos un item');
  }
  for (const item of items) {
    if (!item || !Number.isInteger(item.productoId)) {
      throw new ErrorApi(400, 'Cada item necesita un productoId numérico');
    }
    if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
      throw new ErrorApi(400, 'La cantidad debe ser un entero mayor a 0');
    }
    productoService.obtenerPorId(item.productoId); // 404 si no existe
  }
}

function calcularTotal(pedido) {
  return pedido.items.reduce(
    (suma, { productoId, cantidad }) =>
      suma + productoService.obtenerPorId(productoId).calcularPrecio() * cantidad,
    0
  );
}

function conTotal(pedido) {
  return { ...pedido, total: calcularTotal(pedido) };
}

function crear({ items, estado = 'pendiente' } = {}) {
  validarItems(items);
  if (!ESTADOS.includes(estado)) {
    throw new ErrorApi(400, `Estado inválido. Valores permitidos: ${ESTADOS.join(', ')}`);
  }
  const pedido = {
    id: siguienteId++,
    items: items.map(({ productoId, cantidad }) => ({ productoId, cantidad })),
    estado,
  };
  pedidos.push(pedido);
  return conTotal(pedido);
}

function listar() {
  return pedidos.map(conTotal);
}

function obtenerPorId(id) {
  const pedido = pedidos.find((p) => p.id === Number(id));
  if (!pedido) throw new ErrorApi(404, `Pedido ${id} no encontrado`);
  return conTotal(pedido);
}

function reiniciar() {
  pedidos = [];
  siguienteId = 1;
}

module.exports = { crear, listar, obtenerPorId, calcularTotal, reiniciar, ESTADOS };
