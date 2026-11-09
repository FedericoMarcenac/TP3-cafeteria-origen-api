import { Producto } from './Producto';

// En pastelería no hay café: el precio es directamente el precioBase.
export class Pasteleria extends Producto {
  calcularPrecio(): number {
    return this.precioBase;
  }
}
