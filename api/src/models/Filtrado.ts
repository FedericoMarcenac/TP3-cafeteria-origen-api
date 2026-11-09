import { Cafe, type DatosCafe, type GramosPorTamanio } from './Cafe';

export class Filtrado extends Cafe {
  static readonly ETIQUETA = 'Filtrado';
  static readonly GRAMOS: GramosPorTamanio = { Pocillo: 6, Mediano: 15, 'Taza grande': 25 };
  static readonly PRECIO_BASE = 3200;

  constructor({ id, tamanio, variedad }: DatosCafe) {
    super({
      id,
      tamanio,
      variedad,
      precioBase: Filtrado.PRECIO_BASE,
      etiqueta: Filtrado.ETIQUETA,
      gramosPorTamanio: Filtrado.GRAMOS,
    });
  }
}
