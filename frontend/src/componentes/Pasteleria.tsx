import type { Producto } from '../api/esquemas';
import { formatearPrecio } from '../dominio/precio';

interface Props {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

export function Pasteleria({ productos }: Props) {
  const dulces = productos.filter((p) => p.tipo === 'pasteleria');

  return (
    <section aria-labelledby="titulo-pasteleria">
      <h2 id="titulo-pasteleria" className="h5">
        Pastelería
      </h2>
      <ul className="list-group">
        {dulces.map((p) => (
          <li key={p.id} className="list-group-item">
            <span>{p.nombre}</span>{' '}
            <span className="fw-semibold">{formatearPrecio(p.precio)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}