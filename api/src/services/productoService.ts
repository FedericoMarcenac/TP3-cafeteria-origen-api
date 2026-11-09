import { construirCatalogo } from '../data/catalogo';
import { ErrorApi } from '../errors';
import type { Producto } from '../models/Producto';

const catalogo = construirCatalogo();

export function listar(): Producto[] {
  return catalogo;
}

export function obtenerPorId(id: number | string): Producto {
  const producto = catalogo.find((p) => p.id === Number(id));
  if (!producto) throw new ErrorApi(404, `Producto ${id} no encontrado`);
  return producto;
}
