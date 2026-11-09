import type { Producto, Tamanio } from '../api/esquemas';

export type Bebida = 'expreso' | 'filtrado';
export type Origen = 'Brasil' | 'Colombia' | 'Etiopía';

export interface EleccionCafe {
  bebida?: Bebida;
  tamanio?: Tamanio;
  origen?: Origen;
}

export function buscarCafe(
  productos: Producto[],
  eleccion: EleccionCafe,
): Producto | undefined {
  return productos.find(
    (p) =>
      p.tipo !== 'pasteleria' &&
      p.tipo === eleccion.bebida &&
      p.tamanio === eleccion.tamanio &&
      p.variedad.nombre === eleccion.origen,
  );
}