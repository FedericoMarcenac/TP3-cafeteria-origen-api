import type { NextFunction, Request, Response } from 'express';

function campoDe(err: unknown, campo: string): unknown {
  return typeof err === 'object' && err !== null ? Reflect.get(err, campo) : undefined;
}

export function rutaNoEncontrada(req: Request, res: Response): void {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

// JSON mal formado -> 400; ErrorApi -> su status; cualquier otro -> 500 sin exponer el detalle interno.
export function manejarErrores(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (campoDe(err, 'type') === 'entity.parse.failed') {
    res.status(400).json({ error: 'JSON inválido' });
    return;
  }
  const status = campoDe(err, 'status');
  if (typeof status === 'number' && status >= 400 && status < 500 && err instanceof Error) {
    res.status(status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
