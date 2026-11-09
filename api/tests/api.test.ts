import request from 'supertest';
import app from '../src/app';
import * as pedidoService from '../src/services/pedidoService';

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
      mesaId: null,
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

describe('Productos para el menú de mesa', () => {
  test('un expreso trae tipo, precio y su variedad con descripción', async () => {
    const res = await request(app).get('/productos/5');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: 5,
        tipo: 'expreso',
        tamanio: 'Mediano',
        precio: 7360,
        variedad: {
          nombre: 'Colombia',
          descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
        },
      })
    );
  });

  test('cada producto trae su tipo: expreso, filtrado o pasteleria', async () => {
    const res = await request(app).get('/productos');
    const tipos = res.body.map((producto: { tipo: string }) => producto.tipo);
    expect(tipos).toEqual([
      ...Array(9).fill('expreso'),
      ...Array(9).fill('filtrado'),
      'pasteleria',
      'pasteleria',
    ]);
  });

  test.each<[number, string]>([
    [1, 'Brasil'],
    [2, 'Colombia'],
    [3, 'Etiopía'],
  ])('el producto %i muestra el origen %s con acidez, cuerpo y notas', async (id, nombre) => {
    const res = await request(app).get(`/productos/${id}`);
    expect(res.body.variedad.nombre).toBe(nombre);
    expect(res.body.variedad.descripcion).toMatch(/acidez .+ cuerpo .+ notas/i);
  });

  test('la pastelería trae tipo y precio sin datos de café', async () => {
    const res = await request(app).get('/productos/19');
    expect(res.body).toEqual({
      id: 19,
      tipo: 'pasteleria',
      nombre: 'Muffin de chocolate',
      precioBase: 2500,
      precio: 2500,
    });
  });
});

describe('Pedidos desde la mesa', () => {
  const pedidoDeLaMesa4 = {
    mesaId: 4,
    items: [
      { productoId: 5, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ],
  };

  test('POST /pedidos con mesaId devuelve 201 con la mesa, el estado y el total', async () => {
    const res = await request(app).post('/pedidos').send(pedidoDeLaMesa4);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, ...pedidoDeLaMesa4, estado: 'pendiente', total: 17220 });
  });

  test('sin mesaId el pedido es para retirar en la barra', async () => {
    const res = await request(app).post('/pedidos').send({ items: pedidoDeLaMesa4.items });
    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBeNull();
  });

  test('GET /pedidos/:id devuelve la mesa, el estado, los items y el total', async () => {
    const { body: creado } = await request(app).post('/pedidos').send(pedidoDeLaMesa4);
    const res = await request(app).get(`/pedidos/${creado.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: creado.id, ...pedidoDeLaMesa4, estado: 'pendiente', total: 17220 });
  });

  test('una mesa inexistente responde 404 con el mensaje', async () => {
    const res = await request(app).post('/pedidos').send({ ...pedidoDeLaMesa4, mesaId: 99 });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Mesa 99 no encontrada' });
  });

  test.each<[string, unknown]>([
    ['texto', 'cuatro'],
    ['decimal', 4.5],
    ['número en texto', '4'],
  ])('un mesaId %s responde 400', async (_caso, mesaId) => {
    const res = await request(app).post('/pedidos').send({ ...pedidoDeLaMesa4, mesaId });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'La mesa debe ser un número entero' });
  });

  test('un pedido rechazado por la mesa no se guarda', async () => {
    await request(app).post('/pedidos').send({ ...pedidoDeLaMesa4, mesaId: 99 });
    const res = await request(app).get('/pedidos');
    expect(res.body).toEqual([]);
  });
});
