import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';
import { API_URL } from '../api/config';
import { server } from '../mocks/server';
import { usePedido } from './usePedido';

const ITEMS = [{ productoId: 5, cantidad: 2 }];

function responderPedidosContandolos() {
  let recibidos = 0;
  server.use(
    http.post(`${API_URL}/pedidos`, () => {
      recibidos += 1;
      return HttpResponse.json(
        { id: recibidos, mesaId: 4, items: ITEMS, estado: 'pendiente', total: 14720 },
        { status: 201 }
      );
    })
  );
  return () => recibidos;
}

describe('usePedido: doble envío', () => {
  test('si se confirma dos veces seguidas, la API recibe un solo pedido', async () => {
    const pedidosRecibidos = responderPedidosContandolos();
    const { result } = renderHook(() => usePedido());

    await act(async () => {
      await Promise.all([result.current.confirmar(4, ITEMS), result.current.confirmar(4, ITEMS)]);
    });

    expect(pedidosRecibidos()).toBe(1);
  });

  test('cuando el primer envío termina se puede mandar otro pedido', async () => {
    const pedidosRecibidos = responderPedidosContandolos();
    const { result } = renderHook(() => usePedido());

    await act(async () => {
      await result.current.confirmar(4, ITEMS);
    });
    await act(async () => {
      await result.current.confirmar(4, ITEMS);
    });

    expect(pedidosRecibidos()).toBe(2);
  });
});
