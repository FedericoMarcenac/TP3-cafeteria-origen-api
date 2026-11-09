import cors from 'cors';
import express, { type Express } from 'express';
import { manejarErrores, rutaNoEncontrada } from './middlewares/errores';
import pedidosRouter from './routes/pedidos';
import productosRouter from './routes/productos';
import reportesRouter from './routes/reportes';
import testRouter from './routes/test';

export interface OpcionesApp {
  rutasDeTest: boolean;
}

// Se exporta la app sin listen() para poder testearla con supertest.
export function crearApp({ rutasDeTest }: OpcionesApp): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/productos', productosRouter);
  app.use('/pedidos', pedidosRouter);
  app.use('/reportes', reportesRouter);
  if (rutasDeTest) app.use('/__test__', testRouter);

  app.use(rutaNoEncontrada);
  app.use(manejarErrores);
  return app;
}

export default crearApp({ rutasDeTest: process.env.NODE_ENV === 'test' });
