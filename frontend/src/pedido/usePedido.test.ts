import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
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
});
