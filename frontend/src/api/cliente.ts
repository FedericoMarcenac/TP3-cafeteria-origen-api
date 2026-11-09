import type { z } from 'zod';
import { API_URL } from './config';
import { errorSchema, type ItemPedido, type Pedido, pedidoSchema, type Producto, productosSchema } from './esquemas';

export class ErrorDeApi extends Error {
  readonly status: number;

  constructor(mensaje: string, status: number) {
    super(mensaje);
    this.name = 'ErrorDeApi';
    this.status = status;
  }
}

export class ErrorDeConexion extends Error {
  constructor() {
    super('No se pudo conectar con el servidor. Revisá tu conexión y probá de nuevo.');
    this.name = 'ErrorDeConexion';
  }
}

export class ErrorDeContrato extends Error {
  constructor() {
    super('El servidor respondió con datos que no esperábamos.');
    this.name = 'ErrorDeContrato';
  }
}

export function mensajeDeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado. Probá de nuevo.';
}

async function pedir<T>(ruta: string, esquema: z.ZodType<T>, opciones?: RequestInit): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, opciones);
  } catch {
    throw new ErrorDeConexion();
  }

  const cuerpo: unknown = await respuesta.json().catch(() => undefined);

  if (!respuesta.ok) {
    const error = errorSchema.safeParse(cuerpo);
    const mensaje = error.success ? error.data.error : `El servidor respondió con un error (${respuesta.status}).`;
    throw new ErrorDeApi(mensaje, respuesta.status);
  }

  const datos = esquema.safeParse(cuerpo);
  if (!datos.success) throw new ErrorDeContrato();
  return datos.data;
}

export function obtenerProductos(): Promise<Producto[]> {
  return pedir('/productos', productosSchema);
}

export function crearPedido(mesaId: number | undefined, items: ItemPedido[]): Promise<Pedido> {
  const itemsDelPedido = items.map(({ productoId, cantidad }) => ({ productoId, cantidad }));
  // Sin mesa el pedido es para retirar en la barra: no se manda mesaId.
  const cuerpo = mesaId === undefined ? { items: itemsDelPedido } : { mesaId, items: itemsDelPedido };
  return pedir('/pedidos', pedidoSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
}

export function obtenerPedido(id: number): Promise<Pedido> {
  return pedir(`/pedidos/${id}`, pedidoSchema);
}
