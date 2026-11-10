import type { EstadoPedido, Pedido } from '../api/esquemas';
import { formatearPrecio } from '../dominio/precio';

interface Props {
  pedido: Pedido;
  onActualizar: () => void;
  actualizando?: boolean;
  errorAlActualizar?: string;
}

const ETIQUETAS: Record<EstadoPedido, string> = {
  pendiente: 'pendiente',
  en_preparacion: 'en preparación',
  entregado: 'entregado',
};

export function Confirmacion({ pedido, onActualizar, actualizando = false, errorAlActualizar }: Props) {
  return (
    <section aria-labelledby="titulo-confirmacion" className="card card-body">
      <h2 id="titulo-confirmacion" className="h5">{`Pedido #${pedido.id}`}</h2>
      <p aria-live="polite" className="mb-1">
        Estado: <strong>{ETIQUETAS[pedido.estado]}</strong>
      </p>
      <p>
        Total: <strong>{formatearPrecio(pedido.total)}</strong>
      </p>
      {errorAlActualizar !== undefined && (
        <div role="alert" className="alert alert-danger">
          {errorAlActualizar}
        </div>
      )}
      <button type="button" className="btn btn-outline-primary" onClick={onActualizar} disabled={actualizando}>
        Actualizar estado
      </button>
    </section>
  );
}
