import type { Producto } from '../api/esquemas';
import { formatearPrecio } from '../dominio/precio';

interface Props {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

export function Pasteleria({ productos, onAgregar }: Props) {
  const dulces = productos.filter((p) => p.tipo === 'pasteleria');

  return (
    <section aria-labelledby="titulo-pasteleria">
      <h2 id="titulo-pasteleria" className="h5">
        Pastelería
      </h2>
      <ul className="list-group">
        {dulces.map((p) => (
          <li
            key={p.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {p.nombre}{' '}
              <span className="fw-semibold">{formatearPrecio(p.precio)}</span>
            </span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              aria-label={`Agregar ${p.nombre}`}
              onClick={() => onAgregar(p)}
            >
              Agregar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}