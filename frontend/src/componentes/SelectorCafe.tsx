import { useState } from 'react';
import type { Producto, Tamanio } from '../api/esquemas';
import {
  buscarCafe,
  type Bebida,
  type EleccionCafe,
  type Origen,
} from '../dominio/cafe';

interface Props {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

const BEBIDAS: { valor: Bebida; texto: string }[] = [
  { valor: 'expreso', texto: 'Expreso' },
  { valor: 'filtrado', texto: 'Filtrado' },
];
const TAMANIOS: Tamanio[] = ['Pocillo', 'Mediano', 'Taza grande'];
const ORIGENES: Origen[] = ['Colombia', 'Etiopía', 'Brasil'];

function descripcionDeOrigen(
  productos: Producto[],
  origen: Origen,
): string | undefined {
  for (const p of productos) {
    if (p.tipo !== 'pasteleria' && p.variedad.nombre === origen) {
      return p.variedad.descripcion;
    }
  }
  return undefined;
}

export function SelectorCafe({ productos, onAgregar }: Props) {
  const [eleccion, setEleccion] = useState<EleccionCafe>({});

  const completa = Boolean(
    eleccion.bebida && eleccion.tamanio && eleccion.origen,
  );

  const agregar = () => {
    const producto = buscarCafe(productos, eleccion);
    if (producto) onAgregar(producto);
  };

  return (
    <section aria-labelledby="titulo-cafe">
      <h2 id="titulo-cafe" className="h5">
        Armá tu café
      </h2>

      <fieldset className="mb-3">
        <legend className="h6">Bebida</legend>
        {BEBIDAS.map((b) => (
          <div key={b.valor} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="bebida"
              id={`bebida-${b.valor}`}
              checked={eleccion.bebida === b.valor}
              onChange={() =>
                setEleccion((anterior) => ({ ...anterior, bebida: b.valor }))
              }
            />
            <label className="form-check-label" htmlFor={`bebida-${b.valor}`}>
              {b.texto}
            </label>
          </div>
        ))}
      </fieldset>

      <fieldset className="mb-3">
        <legend className="h6">Tamaño</legend>
        {TAMANIOS.map((t) => (
          <div key={t} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="tamanio"
              id={`tamanio-${t}`}
              checked={eleccion.tamanio === t}
              onChange={() =>
                setEleccion((anterior) => ({ ...anterior, tamanio: t }))
              }
            />
            <label className="form-check-label" htmlFor={`tamanio-${t}`}>
              {t}
            </label>
          </div>
        ))}
      </fieldset>

      <fieldset className="mb-3">
        <legend className="h6">Origen</legend>
        {ORIGENES.map((o) => (
          <div key={o} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="origen"
              id={`origen-${o}`}
              aria-describedby={`descripcion-${o}`}
              checked={eleccion.origen === o}
              onChange={() =>
                setEleccion((anterior) => ({ ...anterior, origen: o }))
              }
            />
            <label className="form-check-label" htmlFor={`origen-${o}`}>
              {o}
            </label>
            <div id={`descripcion-${o}`} className="form-text">
              {descripcionDeOrigen(productos, o)}
            </div>
          </div>
        ))}
      </fieldset>

      <button
        type="button"
        className="btn btn-primary"
        disabled={!completa}
        onClick={agregar}
      >
        Agregar al pedido
      </button>
    </section>
  );
}