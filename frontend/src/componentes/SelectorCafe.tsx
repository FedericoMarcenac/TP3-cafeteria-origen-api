import type { Producto } from '../api/esquemas';

interface Props {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

const BEBIDAS = [
  { valor: 'expreso', texto: 'Expreso' },
  { valor: 'filtrado', texto: 'Filtrado' },
];
const TAMANIOS = ['Pocillo', 'Mediano', 'Taza grande'];
const ORIGENES = ['Colombia', 'Etiopía', 'Brasil'];

export function SelectorCafe(_props: Props) {
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
              value={b.valor}
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
              value={t}
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
              value={o}
            />
            <label className="form-check-label" htmlFor={`origen-${o}`}>
              {o}
            </label>
          </div>
        ))}
      </fieldset>
            <button type="button" className="btn btn-primary" disabled>
        Agregar al pedido
      </button>
    </section>
  );
}