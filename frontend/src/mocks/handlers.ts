import { http, HttpResponse } from 'msw';
import { API_URL } from '../api/config';
import { productosDeLaApi } from './datos';

type EstadoSimulado = 'pendiente' | 'en_preparacion' | 'entregado';

interface ItemSimulado {
  productoId: number;
  cantidad: number;
}

interface PedidoSimulado {
  id: number;
  mesaId: number | null;
  items: ItemSimulado[];
  estado: EstadoSimulado;
  total: number;
}

const CANTIDAD_DE_MESAS = 12;

let pedidos: PedidoSimulado[] = [];

export function reiniciarApiSimulada(): void {
  pedidos = [];
}

function responderError(status: number, mensaje: string) {
  return HttpResponse.json({ error: mensaje }, { status });
}

function campo(objeto: unknown, nombre: string): unknown {
  return typeof objeto === 'object' && objeto !== null ? Reflect.get(objeto, nombre) : undefined;
}

function entero(valor: unknown): number | undefined {
  return typeof valor === 'number' && Number.isInteger(valor) ? valor : undefined;
}

function precioDe(productoId: number): number | undefined {
  return productosDeLaApi.find((producto) => producto.id === productoId)?.precio;
}

export const handlers = [
  http.get(`${API_URL}/productos`, () => HttpResponse.json(productosDeLaApi)),

  http.post(`${API_URL}/pedidos`, async ({ request }) => {
    const cuerpo: unknown = await request.json().catch(() => undefined);

    const mesa = campo(cuerpo, 'mesaId');
    let mesaId: number | null = null;
    if (mesa !== undefined && mesa !== null) {
      const numero = entero(mesa);
      if (numero === undefined) return responderError(400, 'La mesa debe ser un número entero');
      if (numero < 1 || numero > CANTIDAD_DE_MESAS) return responderError(404, `Mesa ${numero} no encontrada`);
      mesaId = numero;
    }

    const items = campo(cuerpo, 'items');
    if (!Array.isArray(items) || items.length === 0) {
      return responderError(400, 'El pedido debe tener al menos un item');
    }
    const lista: unknown[] = items;
    const validos: ItemSimulado[] = [];
    let total = 0;
    for (const item of lista) {
      const productoId = entero(campo(item, 'productoId'));
      if (productoId === undefined) return responderError(400, 'Cada item necesita un productoId numérico');
      const cantidad = entero(campo(item, 'cantidad'));
      if (cantidad === undefined || cantidad <= 0) {
        return responderError(400, 'La cantidad debe ser un entero mayor a 0');
      }
      const precio = precioDe(productoId);
      if (precio === undefined) return responderError(404, `Producto ${productoId} no encontrado`);
      validos.push({ productoId, cantidad });
      total += precio * cantidad;
    }

    const pedido: PedidoSimulado = { id: pedidos.length + 1, mesaId, items: validos, estado: 'pendiente', total };
    pedidos.push(pedido);
    return HttpResponse.json(pedido, { status: 201 });
  }),

  http.get(`${API_URL}/pedidos/:id`, ({ params }) => {
    const pedido = pedidos.find((p) => p.id === Number(params.id));
    if (!pedido) return responderError(404, `Pedido ${String(params.id)} no encontrado`);
    return HttpResponse.json(pedido);
  }),
];
