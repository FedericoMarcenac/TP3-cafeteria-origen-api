const Producto = require('./Producto');

const PRECIO_POR_GRAMO = { Brasil: 140, Colombia: 180, Etiopia: 240 };

// Clase intermedia: Expreso y Filtrado calculan igual, solo cambian los gramos y el precioBase.
class Cafe extends Producto {
  constructor({ id, tamanio, variedad, precioBase }) {
    super({ id, nombre: '', precioBase });
    if (!(variedad in PRECIO_POR_GRAMO)) throw new Error(`Variedad inválida: ${variedad}`);
    const gramos = this.constructor.GRAMOS[tamanio];
    if (gramos === undefined) throw new Error(`Tamaño inválido: ${tamanio}`);
    this.tamanio = tamanio;
    this.variedad = variedad;
    this.gramos = gramos;
    this.nombre = `${this.constructor.ETIQUETA} ${tamanio} ${variedad}`;
  }

  costoCafe() {
    return this.gramos * PRECIO_POR_GRAMO[this.variedad];
  }

  calcularPrecio() {
    return this.precioBase + this.costoCafe();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      tamanio: this.tamanio,
      variedad: this.variedad,
      gramos: this.gramos,
      costoCafe: this.costoCafe(),
    };
  }
}

module.exports = { Cafe, PRECIO_POR_GRAMO };
