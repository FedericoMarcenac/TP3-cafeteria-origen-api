import { useCallback, useState } from 'react';
import { crearPedido, mensajeDeError } from '../api/cliente';
import type { ItemPedido, Pedido } from '../api/esquemas';

export type EstadoDelEnvio =
  | { estado: 'editando' }
  | { estado: 'enviando' }
  | { estado: 'confirmado'; pedido: Pedido }
  | { estado: 'error'; mensaje: string };

/**
 * Maneja el envío del pedido.
 * `onConfirmado` se llama solo si la API aceptó el pedido (por ejemplo, para vaciar el carrito).
 */
export function usePedido(onConfirmado?: () => void) {
  const [envio, setEnvio] = useState<EstadoDelEnvio>({ estado: 'editando' });

  const confirmar = useCallback(
    async (mesaId: number | undefined, items: ItemPedido[]): Promise<void> => {
      setEnvio({ estado: 'enviando' });
      let pedido: Pedido;
      try {
        pedido = await crearPedido(mesaId, items);
      } catch (error: unknown) {
        setEnvio({ estado: 'error', mensaje: mensajeDeError(error) });
        return;
      }
      setEnvio({ estado: 'confirmado', pedido });
      onConfirmado?.();
    },
    [onConfirmado]
  );

  const volverAEditar = useCallback(() => setEnvio({ estado: 'editando' }), []);

  return { envio, confirmar, volverAEditar };
}
