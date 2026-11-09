const Expreso = require('../models/Expreso');
const Filtrado = require('../models/Filtrado');
const Pasteleria = require('../models/Pasteleria');

const TAMANIOS = ['Pocillo', 'Mediano', 'Taza grande'];
const VARIEDADES = ['Brasil', 'Colombia', 'Etiopia'];

// Ids: 1-9 expresos, 10-18 filtrados, 19 muffin, 20 torta.
function construirCatalogo() {
  const productos = [];
  let id = 1;
  for (const Clase of [Expreso, Filtrado]) {
    for (const tamanio of TAMANIOS) {
      for (const variedad of VARIEDADES) {
        productos.push(new Clase({ id: id++, tamanio, variedad }));
      }
    }
  }
  productos.push(new Pasteleria({ id: id++, nombre: 'Muffin de chocolate', precioBase: 2500 }));
  productos.push(new Pasteleria({ id: id++, nombre: 'Torta selva negra', precioBase: 4200 }));
  return productos;
}

module.exports = { construirCatalogo };
