const express = require('express');
const productosRouter = require('./routes/productos');
const pedidosRouter = require('./routes/pedidos');
const reportesRouter = require('./routes/reportes');

// Se exporta la app sin listen() para poder testearla con supertest.
const app = express();
app.use(express.json());

app.use('/productos', productosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/reportes', reportesRouter);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// JSON mal formado -> 400; ErrorApi -> su status; cualquier otro -> 500.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
