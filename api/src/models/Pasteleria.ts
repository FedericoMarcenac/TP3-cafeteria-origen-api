import { Producto } from './Producto';

// En pastelería no hay café: el precio es directamente el precioBase.
export class Pasteleria extends Producto {
  readonly tipo = 'pasteleria';

  calcularPrecio(): number {
    return this.precioBase;
  }
}
