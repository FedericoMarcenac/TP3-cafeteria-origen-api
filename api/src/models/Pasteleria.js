const Producto = require('./Producto');

// En pastelería no hay café: el precio es directamente el precioBase.
class Pasteleria extends Producto {
  calcularPrecio() {
    return this.precioBase;
  }
}

module.exports = Pasteleria;
