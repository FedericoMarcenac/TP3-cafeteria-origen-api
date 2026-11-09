export interface DatosProducto {
  id: number;
  nombre: string;
  precioBase: number;
}

export interface ProductoJSON {
  id: number;
  nombre: string;
  tipo: string;
  precioBase: number;
  precio: number;
}

// Clase base: define el contrato común (id, nombre, precioBase, calcularPrecio).
export abstract class Producto {
  id: number;
  nombre: string;
  precioBase: number;

  constructor({ id, nombre, precioBase }: DatosProducto) {
    if (new.target === Producto) {
      throw new Error('Producto es abstracta: usá Expreso, Filtrado o Pasteleria');
    }
    this.id = id;
    this.nombre = nombre;
    this.precioBase = precioBase;
  }

  abstract calcularPrecio(): number;

  toJSON(): ProductoJSON {
    return {
      id: this.id,
      nombre: this.nombre,
      tipo: this.constructor.name,
      precioBase: this.precioBase,
      precio: this.calcularPrecio(),
    };
  }
}
