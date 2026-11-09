import express from 'express';
import request from 'supertest';
import app from '../src/app';
import { manejarErrores } from '../src/middlewares/errores';
import * as pedidoService from '../src/services/pedidoService';

beforeEach(() => pedidoService.reiniciar());

function esperarError(res: request.Response, status: number): void {
  expect(res.status).toBe(status);
  expect(Object.keys(res.body)).toEqual(['error']);
  expect(typeof res.body.error).toBe('string');
}

describe('Errores inesperados', () => {
  test('responden 500 con un mensaje genérico, sin el detalle interno', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const appConFalla = express();
    appConFalla.get('/falla', () => {
      throw new Error('detalle interno de la base');
    });
    appConFalla.use(manejarErrores);

    const res = await request(appConFalla).get('/falla');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Error interno del servidor' });
  });
});

describe('Los errores del cliente son 4xx con { error }, nunca 500', () => {
  test('producto con id no numérico', async () => {
    esperarError(await request(app).get('/productos/abc'), 404);
  });
  test('pedido inexistente', async () => {
    esperarError(await request(app).get('/pedidos/abc'), 404);
  });
  test('producto inexistente dentro del pedido', async () => {
    const res = await request(app).post('/pedidos').send({ items: [{ productoId: 999, cantidad: 1 }] });
    esperarError(res, 404);
  });
  test('mesa inexistente', async () => {
    const res = await request(app).post('/pedidos').send({ mesaId: 99, items: [{ productoId: 1, cantidad: 1 }] });
    esperarError(res, 404);
  });
  test('items que no son objetos', async () => {
    esperarError(await request(app).post('/pedidos').send({ items: [1, 'dos'] }), 400);
  });
  test('JSON mal formado', async () => {
    const res = await request(app).post('/pedidos').set('Content-Type', 'application/json').send('{malo');
    esperarError(res, 400);
  });
  test('ruta inexistente', async () => {
    esperarError(await request(app).delete('/pedidos'), 404);
  });
});

describe('CORS', () => {
  test('permite leer el menú desde otro origen', async () => {
    const res = await request(app).get('/productos').set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });
  test('responde el preflight de POST /pedidos', async () => {
    const res = await request(app)
      .options('/pedidos')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');
    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-methods']).toContain('POST');
  });
});
