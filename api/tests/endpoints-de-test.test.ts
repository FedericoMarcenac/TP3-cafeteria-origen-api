import request from 'supertest';
import app, { crearApp } from '../src/app';
import * as pedidoService from '../src/services/pedidoService';

const unMuffin = { items: [{ productoId: 19, cantidad: 1 }] };

beforeEach(() => pedidoService.reiniciar());

describe('Endpoints para los E2E con NODE_ENV=test', () => {
  test('POST /__test__/reset borra los pedidos y reinicia los ids', async () => {
    await request(app).post('/pedidos').send(unMuffin);
    await request(app).post('/pedidos').send(unMuffin);

    const res = await request(app).post('/__test__/reset');

    expect(res.status).toBe(204);
    expect((await request(app).get('/pedidos')).body).toEqual([]);
    expect((await request(app).post('/pedidos').send(unMuffin)).body.id).toBe(1);
  });

  test('POST /__test__/seed deja siempre los mismos datos', async () => {
    await request(app).post('/pedidos').send(unMuffin);

    const res = await request(app).post('/__test__/seed');

    expect(res.status).toBe(201);
    expect(res.body).toEqual([
      { id: 1, mesaId: 1, items: [{ productoId: 20, cantidad: 1 }], estado: 'entregado', total: 4200 },
    ]);
    expect((await request(app).get('/pedidos')).body).toHaveLength(1);
  });

  test('después del seed, el próximo pedido es el número 2', async () => {
    await request(app).post('/__test__/seed');
    const res = await request(app).post('/pedidos').send({ mesaId: 4, ...unMuffin });
    expect(res.body.id).toBe(2);
  });

  test('fuera del entorno de test esas rutas no existen', async () => {
    const appDeProduccion = crearApp({ rutasDeTest: false });
    expect((await request(appDeProduccion).post('/__test__/reset')).status).toBe(404);
    expect((await request(appDeProduccion).post('/__test__/seed')).status).toBe(404);
  });
});
