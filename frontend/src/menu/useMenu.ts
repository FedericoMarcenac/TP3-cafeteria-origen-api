import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError, obtenerProductos } from '../api/cliente';
import type { Producto } from '../api/esquemas';

export type EstadoMenu =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'listo'; productos: Producto[] };

export function useMenu(): { menu: EstadoMenu; reintentar: () => void } {
  const [menu, setMenu] = useState<EstadoMenu>({ estado: 'cargando' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;
    obtenerProductos()
      .then((productos) => {
        if (vigente) setMenu({ estado: 'listo', productos });
      })
      .catch((error: unknown) => {
        if (vigente) setMenu({ estado: 'error', mensaje: mensajeDeError(error) });
      });
    return () => {
      vigente = false;
    };
  }, [intento]);

  const reintentar = useCallback(() => {
    setMenu({ estado: 'cargando' });
    setIntento((anterior) => anterior + 1);
  }, []);

  return { menu, reintentar };
}
