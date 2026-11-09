const { Cafe } = require('./Cafe');

class Filtrado extends Cafe {
  static ETIQUETA = 'Filtrado';
  static GRAMOS = { Pocillo: 6, Mediano: 15, 'Taza grande': 25 };
  static PRECIO_BASE = 3200;

  constructor({ id, tamanio, variedad }) {
    super({ id, tamanio, variedad, precioBase: Filtrado.PRECIO_BASE });
  }
}

module.exports = Filtrado;
