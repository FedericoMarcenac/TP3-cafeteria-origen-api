import { Producto, type ProductoJSON } from './Producto';

export const PRECIO_POR_GRAMO = { Brasil: 140, Colombia: 180, Etiopia: 240 } as const;

export type Variedad = keyof typeof PRECIO_POR_GRAMO;

export interface DetalleVariedad {
  nombre: string;
  descripcion: string;
}

export const DETALLE_VARIEDAD: Record<Variedad, DetalleVariedad> = {
  Brasil: {
    nombre: 'Brasil',
    descripcion: 'Acidez baja, cuerpo intenso y notas a chocolate y frutos secos',
  },
  Colombia: {
    nombre: 'Colombia',
    descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
  },
  Etiopia: {
    nombre: 'Etiopía',
    descripcion: 'Acidez alta, cuerpo ligero y notas a frutos rojos y jazmín',
  },
};
export type Tamanio = 'Pocillo' | 'Mediano' | 'Taza grande';
export type GramosPorTamanio = Record<Tamanio, number>;

export interface DatosCafe {
  id: number;
  tamanio: string;
  variedad: string;
}

interface DatosConstruccionCafe extends DatosCafe {
  precioBase: number;
  etiqueta: string;
  gramosPorTamanio: GramosPorTamanio;
}

export interface CafeJSON extends ProductoJSON {
  tamanio: Tamanio;
  variedad: DetalleVariedad;
  gramos: number;
  costoCafe: number;
}

function esVariedad(valor: string): valor is Variedad {
  return Object.hasOwn(PRECIO_POR_GRAMO, valor);
}

function esTamanio(valor: string, gramosPorTamanio: GramosPorTamanio): valor is Tamanio {
  return Object.hasOwn(gramosPorTamanio, valor);
}

// Clase intermedia: Expreso y Filtrado calculan igual, solo cambian los gramos y el precioBase.
export abstract class Cafe extends Producto {
  tamanio: Tamanio;
  variedad: Variedad;
  gramos: number;

  constructor({ id, tamanio, variedad, precioBase, etiqueta, gramosPorTamanio }: DatosConstruccionCafe) {
    super({ id, nombre: '', precioBase });
    if (!esVariedad(variedad)) throw new Error(`Variedad inválida: ${variedad}`);
    if (!esTamanio(tamanio, gramosPorTamanio)) throw new Error(`Tamaño inválido: ${tamanio}`);
    this.tamanio = tamanio;
    this.variedad = variedad;
    this.gramos = gramosPorTamanio[tamanio];
    this.nombre = `${etiqueta} ${tamanio} ${DETALLE_VARIEDAD[variedad].nombre}`;
  }

  costoCafe(): number {
    return this.gramos * PRECIO_POR_GRAMO[this.variedad];
  }

  calcularPrecio(): number {
    return this.precioBase + this.costoCafe();
  }

  toJSON(): CafeJSON {
    return {
      ...super.toJSON(),
      tamanio: this.tamanio,
      variedad: DETALLE_VARIEDAD[this.variedad],
      gramos: this.gramos,
      costoCafe: this.costoCafe(),
    };
  }
}
