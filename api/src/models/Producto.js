// Clase base: define el contrato común (id, nombre, precioBase, calcularPrecio).
class Producto {
  constructor({ id, nombre, precioBase }) {
    if (new.target === Producto) {
      throw new Error('Producto es abstracta: usá Expreso, Filtrado o Pasteleria');
    }
    this.id = id;
    this.nombre = nombre;
    this.precioBase = precioBase;
  }

  calcularPrecio() {
    throw new Error('calcularPrecio() debe implementarse en la subclase');
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      tipo: this.constructor.name,
      precioBase: this.precioBase,
      precio: this.calcularPrecio(),
    };
  }
}

module.exports = Producto;
