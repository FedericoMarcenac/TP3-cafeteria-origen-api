const request = require('supertest');
const app = require('../src/app');
const pedidoService = require('../src/services/pedidoService');

beforeEach(() => pedidoService.reiniciar());

describe('GET /productos', () => {
  test('200 y lista de 20 productos con precio', async () => {
    const res = await request(app).get('/productos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(20);
    expect(res.body[0]).toEqual(expect.objectContaining({ id: 1, precio: 5020 }));
  });
});

describe('GET /productos/:id', () => {
  test('200 con el producto pedido', async () => {
    const res = await request(app).get('/productos/20');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({ nombre: 'Torta selva negra', precio: 4200 }));
  });
  test('404 si no existe', async () => {
    const res = await request(app).get('/productos/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/no encontrado/);
  });
});

describe('POST /pedidos', () => {
  test('201 y devuelve el pedido con su total', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({ items: [{ productoId: 1, cantidad: 2 }, { productoId: 19, cantidad: 1 }] });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 1,
      items: [{ productoId: 1, cantidad: 2 }, { productoId: 19, cantidad: 1 }],
      estado: 'pendiente',
      total: 5020 * 2 + 2500,
    });
  });
  test('400 si no hay items', async () => {
    const res = await request(app).post('/pedidos').send({ items: [] });
    expect(res.status).toBe(400);
  });
  test('400 si la cantidad es inválida', async () => {
    const res = await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 0 }] });
    expect(res.status).toBe(400);
  });
  test('404 si el producto no existe', async () => {
    const res = await request(app).post('/pedidos').send({ items: [{ productoId: 999, cantidad: 1 }] });
    expect(res.status).toBe(404);
  });
  test('400 si el JSON está mal formado', async () => {
    const res = await request(app).post('/pedidos').set('Content-Type', 'application/json').send('{malo');
    expect(res.status).toBe(400);
  });
});

describe('GET /pedidos y /pedidos/:id', () => {
  test('lista vacía al principio', async () => {
    const res = await request(app).get('/pedidos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
  test('lista los pedidos creados', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: 19, cantidad: 1 }] });
    await request(app).post('/pedidos').send({ items: [{ productoId: 20, cantidad: 1 }] });
    const res = await request(app).get('/pedidos');
    expect(res.body).toHaveLength(2);
  });
  test('devuelve un pedido por id', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: 20, cantidad: 2 }] });
    const res = await request(app).get('/pedidos/1');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(8400);
  });
  test('404 si el pedido no existe', async () => {
    const res = await request(app).get('/pedidos/42');
    expect(res.status).toBe(404);
  });
});

describe('Reportes', () => {
  test('GET /reportes/facturacion', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: 20, cantidad: 1 }] });
    await request(app).post('/pedidos').send({ items: [{ productoId: 19, cantidad: 2 }] });
    const res = await request(app).get('/reportes/facturacion');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ facturacionTotal: 9200 });
  });
  test('GET /reportes/mas-vendido', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: 19, cantidad: 3 }, { productoId: 20, cantidad: 1 }] });
    const res = await request(app).get('/reportes/mas-vendido');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ producto: 'Muffin de chocolate', cantidad: 3 });
  });
  test('mas-vendido sin ventas devuelve null', async () => {
    const res = await request(app).get('/reportes/mas-vendido');
    expect(res.body).toEqual({ producto: null, cantidad: 0 });
  });
});

describe('Rutas inexistentes', () => {
  test('404 JSON', async () => {
    const res = await request(app).get('/nada');
    expect(res.status).toBe(404);
  });
});
