import * as productoService from './productoService';
import { existeMesa } from '../data/mesas';
import { ErrorApi } from '../errors';

export const ESTADOS = ['pendiente', 'en_preparacion', 'entregado'] as const;

export type Estado = (typeof ESTADOS)[number];

export interface ItemPedido {
  productoId: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  mesaId: number | null;
  items: ItemPedido[];
  estado: Estado;
}

export interface PedidoConTotal extends Pedido {
  total: number;
}

export interface DatosPedido {
  mesaId?: unknown;
  items?: unknown;
  estado?: unknown;
}

let pedidos: Pedido[] = [];
let siguienteId = 1;

function esEstado(valor: unknown): valor is Estado {
  return ESTADOS.some((estado) => estado === valor);
}

function leerEntero(item: unknown, campo: string): number | undefined {
  if (typeof item !== 'object' || item === null) return undefined;
  const valor: unknown = Reflect.get(item, campo);
  return typeof valor === 'number' && Number.isInteger(valor) ? valor : undefined;
}

function validarMesa(mesaId: unknown): number | null {
  if (mesaId === undefined || mesaId === null) return null;
  if (typeof mesaId !== 'number' || !Number.isInteger(mesaId)) {
    throw new ErrorApi(400, 'La mesa debe ser un número entero');
  }
  if (!existeMesa(mesaId)) throw new ErrorApi(404, `Mesa ${mesaId} no encontrada`);
  return mesaId;
}

function validarItems(items: unknown): ItemPedido[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ErrorApi(400, 'El pedido debe tener al menos un item');
  }
  const lista: unknown[] = items;
  return lista.map((item) => {
    const productoId = leerEntero(item, 'productoId');
    if (productoId === undefined) {
      throw new ErrorApi(400, 'Cada item necesita un productoId numérico');
    }
    const cantidad = leerEntero(item, 'cantidad');
    if (cantidad === undefined || cantidad <= 0) {
      throw new ErrorApi(400, 'La cantidad debe ser un entero mayor a 0');
    }
    productoService.obtenerPorId(productoId); // 404 si no existe
    return { productoId, cantidad };
  });
}

export function calcularTotal(pedido: Pedido): number {
  return pedido.items.reduce(
    (suma, { productoId, cantidad }) =>
      suma + productoService.obtenerPorId(productoId).calcularPrecio() * cantidad,
    0
  );
}

function conTotal(pedido: Pedido): PedidoConTotal {
  return { ...pedido, total: calcularTotal(pedido) };
}

export function crear({ mesaId, items, estado = 'pendiente' }: DatosPedido = {}): PedidoConTotal {
  const mesa = validarMesa(mesaId);
  const itemsValidos = validarItems(items);
  if (!esEstado(estado)) {
    throw new ErrorApi(400, `Estado inválido. Valores permitidos: ${ESTADOS.join(', ')}`);
  }
  const pedido: Pedido = { id: siguienteId++, mesaId: mesa, items: itemsValidos, estado };
  pedidos.push(pedido);
  return conTotal(pedido);
}

export function listar(): PedidoConTotal[] {
  return pedidos.map(conTotal);
}

export function obtenerPorId(id: number | string): PedidoConTotal {
  const pedido = pedidos.find((p) => p.id === Number(id));
  if (!pedido) throw new ErrorApi(404, `Pedido ${id} no encontrado`);
  return conTotal(pedido);
}

export function reiniciar(): void {
  pedidos = [];
  siguienteId = 1;
}
