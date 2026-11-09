import { useCallback, useState } from 'react';
import { crearPedido, mensajeDeError, obtenerPedido } from '../api/cliente';
import type { ItemPedido, Pedido } from '../api/esquemas';

export type EstadoDelEnvio =
  | { estado: 'editando' }
  | { estado: 'enviando' }
  | { estado: 'confirmado'; pedido: Pedido; actualizando: boolean; errorAlActualizar?: string }
  | { estado: 'error'; mensaje: string };

/**
 * Maneja el envío del pedido y el seguimiento de su estado.
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
      setEnvio({ estado: 'confirmado', pedido, actualizando: false });
      onConfirmado?.();
    },
    [onConfirmado]
  );

  const actualizar = useCallback(async (): Promise<void> => {
    if (envio.estado !== 'confirmado') return;
    const { pedido } = envio;
    setEnvio({ estado: 'confirmado', pedido, actualizando: true });
    try {
      const pedidoActual = await obtenerPedido(pedido.id);
      setEnvio({ estado: 'confirmado', pedido: pedidoActual, actualizando: false });
    } catch (error: unknown) {
      setEnvio({ estado: 'confirmado', pedido, actualizando: false, errorAlActualizar: mensajeDeError(error) });
    }
  }, [envio]);

  const volverAEditar = useCallback(() => setEnvio({ estado: 'editando' }), []);

  return { envio, confirmar, actualizar, volverAEditar };
}
