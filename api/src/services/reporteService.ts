import * as pedidoService from './pedidoService';
import * as productoService from './productoService';

export interface MasVendido {
  producto: string | null;
  cantidad: number;
}

export function facturacionTotal(): number {
  return pedidoService.listar().reduce((suma, pedido) => suma + pedido.total, 0);
}

export function cantidadPorProducto(): Record<string, number> {
  const cantidades: Record<string, number> = {};
  for (const pedido of pedidoService.listar()) {
    for (const { productoId, cantidad } of pedido.items) {
      const { nombre } = productoService.obtenerPorId(productoId);
      cantidades[nombre] = (cantidades[nombre] ?? 0) + cantidad;
    }
  }
  return cantidades;
}

export function masVendido(): MasVendido {
  const entradas = Object.entries(cantidadPorProducto());
  if (entradas.length === 0) return { producto: null, cantidad: 0 };
  const [producto, cantidad] = entradas.reduce((max, actual) => (actual[1] > max[1] ? actual : max));
  return { producto, cantidad };
}
