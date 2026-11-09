const { construirCatalogo } = require('../data/catalogo');
const { ErrorApi } = require('../errors');

const catalogo = construirCatalogo();

function listar() {
  return catalogo;
}

function obtenerPorId(id) {
  const producto = catalogo.find((p) => p.id === Number(id));
  if (!producto) throw new ErrorApi(404, `Producto ${id} no encontrado`);
  return producto;
}

module.exports = { listar, obtenerPorId };
