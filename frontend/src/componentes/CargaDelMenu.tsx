import type { ReactNode } from 'react';
import type { Producto } from '../api/esquemas';
import type { EstadoMenu } from '../menu/useMenu';

interface Props {
  menu: EstadoMenu;
  onReintentar: () => void;
  children: (productos: Producto[]) => ReactNode;
}

export function CargaDelMenu({ menu, onReintentar, children }: Props) {
  switch (menu.estado) {
    case 'cargando':
      return (
        <div role="status" className="d-flex align-items-center justify-content-center gap-2 py-5 text-secondary">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          Cargando el menú…
        </div>
      );
    case 'error':
      return (
        <div role="alert" className="alert alert-danger">
          <p className="fw-semibold mb-1">No pudimos cargar el menú</p>
          <p className="mb-3">{menu.mensaje}</p>
          <button type="button" className="btn btn-outline-danger" onClick={onReintentar}>
            Reintentar
          </button>
        </div>
      );
    case 'listo':
      return children(menu.productos);
  }
}
