const { Cafe } = require('./Cafe');

class Expreso extends Cafe {
  static ETIQUETA = 'Expreso';
  static GRAMOS = { Pocillo: 18, Mediano: 27, 'Taza grande': 36 };
  static PRECIO_BASE = 2500;

  constructor({ id, tamanio, variedad }) {
    super({ id, tamanio, variedad, precioBase: Expreso.PRECIO_BASE });
  }
}

module.exports = Expreso;
