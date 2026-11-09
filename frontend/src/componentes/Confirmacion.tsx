import type { EstadoPedido, Pedido } from '../api/esquemas';

interface Props {
  pedido: Pedido;
}

const ETIQUETAS: Record<EstadoPedido, string> = {
  pendiente: 'pendiente',
  en_preparacion: 'en preparación',
  entregado: 'entregado',
};

// TODO: cuando esté en main el formatearPrecio de Fede, usar ese y borrar esta función.
function formatearTotal(valor: number): string {
  return `$${String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export function Confirmacion({ pedido }: Props) {
  return (
    <section aria-labelledby="titulo-confirmacion" className="card card-body">
      <h2 id="titulo-confirmacion" className="h5">{`Pedido #${pedido.id}`}</h2>
      <p aria-live="polite" className="mb-1">
        Estado: <strong>{ETIQUETAS[pedido.estado]}</strong>
      </p>
      <p className="mb-0">
        Total: <strong>{formatearTotal(pedido.total)}</strong>
      </p>
    </section>
  );
}
