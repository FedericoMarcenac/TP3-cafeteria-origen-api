import cors from 'cors';
import express from 'express';
import { manejarErrores, rutaNoEncontrada } from './middlewares/errores';
import pedidosRouter from './routes/pedidos';
import productosRouter from './routes/productos';
import reportesRouter from './routes/reportes';

// Se exporta la app sin listen() para poder testearla con supertest.
const app = express();
app.use(cors());
app.use(express.json());

app.use('/productos', productosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/reportes', reportesRouter);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

export default app;
