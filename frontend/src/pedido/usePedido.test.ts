import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, test, vi } from 'vitest';
import { API_URL } from '../api/config';
import { server } from '../mocks/server';
import { usePedido } from './usePedido';

const ITEMS = [
  { productoId: 5, cantidad: 2 },
  { productoId: 19, cantidad: 1 },
];

describe('usePedido', () => {
  test('arranca en editando', () => {
    const { result } = renderHook(() => usePedido());

    expect(result.current.envio).toEqual({ estado: 'editando' });
  });

  test('si la API acepta el pedido queda confirmado y avisa una sola vez', async () => {
    const onConfirmado = vi.fn();
    const { result } = renderHook(() => usePedido(onConfirmado));

    await act(async () => {
      await result.current.confirmar(4, ITEMS);
    });

    expect(result.current.envio).toMatchObject({
      estado: 'confirmado',
      pedido: { id: 1, mesaId: 4, estado: 'pendiente', total: 17220 },
    });
    expect(onConfirmado).toHaveBeenCalledTimes(1);
  });

  test('actualizar trae el estado nuevo del pedido', async () => {
    const { result } = renderHook(() => usePedido());
    await act(async () => {
      await result.current.confirmar(4, ITEMS);
    });
    server.use(
      http.get(`${API_URL}/pedidos/:id`, () =>
        HttpResponse.json({ id: 1, mesaId: 4, items: ITEMS, estado: 'en_preparacion', total: 17220 })
      )
    );

    await act(async () => {
      await result.current.actualizar();
    });

    expect(result.current.envio).toMatchObject({
      estado: 'confirmado',
      pedido: { id: 1, estado: 'en_preparacion' },
      actualizando: false,
    });
  });

  test('si falla al actualizar conserva el pedido y guarda el mensaje', async () => {
    const { result } = renderHook(() => usePedido());
    await act(async () => {
      await result.current.confirmar(4, ITEMS);
    });
    server.use(http.get(`${API_URL}/pedidos/:id`, () => HttpResponse.error()));

    await act(async () => {
      await result.current.actualizar();
    });

    expect(result.current.envio).toMatchObject({
      estado: 'confirmado',
      pedido: { id: 1, estado: 'pendiente' },
      actualizando: false,
      errorAlActualizar: expect.stringContaining('No se pudo conectar') as unknown,
    });
  });

  test('actualizar no hace nada si todavía no hay pedido confirmado', async () => {
    const { result } = renderHook(() => usePedido());

    await act(async () => {
      await result.current.actualizar();
    });

    expect(result.current.envio).toEqual({ estado: 'editando' });
  });
});
