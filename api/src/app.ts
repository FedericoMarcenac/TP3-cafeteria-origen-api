import express, { type NextFunction, type Request, type Response } from 'express';
import pedidosRouter from './routes/pedidos';
import productosRouter from './routes/productos';
import reportesRouter from './routes/reportes';

function campoDe(err: unknown, campo: string): unknown {
  return typeof err === 'object' && err !== null ? Reflect.get(err, campo) : undefined;
}

// Se exporta la app sin listen() para poder testearla con supertest.
const app = express();
app.use(express.json());

app.use('/productos', productosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/reportes', reportesRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// JSON mal formado -> 400; ErrorApi -> su status; cualquier otro -> 500.
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (campoDe(err, 'type') === 'entity.parse.failed') {
    res.status(400).json({ error: 'JSON inválido' });
    return;
  }
  const status = campoDe(err, 'status');
  const mensaje = err instanceof Error ? err.message : 'Error interno del servidor';
  res.status(typeof status === 'number' ? status : 500).json({ error: mensaje });
});

export default app;
