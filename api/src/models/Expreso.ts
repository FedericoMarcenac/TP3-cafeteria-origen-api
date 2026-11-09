import { Cafe, type DatosCafe, type GramosPorTamanio } from './Cafe';

export class Expreso extends Cafe {
  static readonly ETIQUETA = 'Expreso';
  static readonly GRAMOS: GramosPorTamanio = { Pocillo: 18, Mediano: 27, 'Taza grande': 36 };
  static readonly PRECIO_BASE = 2500;

  constructor({ id, tamanio, variedad }: DatosCafe) {
    super({
      id,
      tamanio,
      variedad,
      precioBase: Expreso.PRECIO_BASE,
      etiqueta: Expreso.ETIQUETA,
      gramosPorTamanio: Expreso.GRAMOS,
    });
  }
}
