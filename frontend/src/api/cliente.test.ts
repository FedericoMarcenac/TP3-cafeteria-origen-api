import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';
import { server } from '../mocks/server';
import {
  crearPedido,
  ErrorDeApi,
  ErrorDeConexion,
  ErrorDeContrato,
  mensajeDeError,
  obtenerPedido,
  obtenerProductos,
} from './cliente';
import { API_URL } from './config';

function responderProductos(respuesta: () => Response) {
  server.use(http.get(`${API_URL}/productos`, respuesta));
}

describe('obtenerProductos', () => {
  test('devuelve los productos validados con el contrato', async () => {
    const productos = await obtenerProductos();

    expect(productos).toHaveLength(20);
    expect(productos.find((producto) => producto.id === 5)).toEqual({
      id: 5,
      tipo: 'expreso',
      nombre: 'Expreso Mediano Colombia',
      precio: 7360,
      tamanio: 'Mediano',
      variedad: {
        nombre: 'Colombia',
        descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
      },
    });
  });

  test('si la API responde un error, lanza ErrorDeApi con su mensaje y su código', async () => {
    responderProductos(() => HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 }));

    const error = await obtenerProductos().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ErrorDeApi);
    expect(error).toMatchObject({ message: 'Error interno del servidor', status: 500 });
  });

  test('si el error no trae el formato de la API, avisa el código', async () => {
    responderProductos(() => new HttpResponse('<h1>Bad Gateway</h1>', { status: 502 }));

    const error = await obtenerProductos().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ErrorDeApi);
    expect(error).toMatchObject({ message: 'El servidor respondió con un error (502).', status: 502 });
  });

  test('si la API está caída, lanza ErrorDeConexion', async () => {
    responderProductos(() => HttpResponse.error());

    await expect(obtenerProductos()).rejects.toBeInstanceOf(ErrorDeConexion);
  });

  test('si la respuesta no cumple el contrato, lanza ErrorDeContrato', async () => {
    responderProductos(() => HttpResponse.json([{ id: 5, tipo: 'expreso', nombre: 'Expreso', precio: '7360' }]));

    await expect(obtenerProductos()).rejects.toBeInstanceOf(ErrorDeContrato);
  });
});

describe('mensajeDeError', () => {
  test('usa el mensaje del error', () => {
    expect(mensajeDeError(new ErrorDeApi('Mesa 99 no encontrada', 404))).toBe('Mesa 99 no encontrada');
  });

  test('da un mensaje genérico si lo que llegó no es un error', () => {
    expect(mensajeDeError('algo raro')).toBe('Ocurrió un error inesperado. Probá de nuevo.');
  });
});

const ITEMS = [
  { productoId: 5, cantidad: 2 },
  { productoId: 19, cantidad: 1 },
];

describe('crearPedido', () => {
  test('envía mesaId e items y devuelve el pedido creado', async () => {
    const pedido = await crearPedido(4, ITEMS);

    expect(pedido).toEqual({ id: 1, mesaId: 4, items: ITEMS, estado: 'pendiente', total: 17220 });
  });

  test('manda el cuerpo como JSON con mesaId e items', async () => {
    let cuerpo: unknown;
    server.use(
      http.post(`${API_URL}/pedidos`, async ({ request }) => {
        cuerpo = await request.json();
        return HttpResponse.json({ id: 1, mesaId: 4, items: ITEMS, estado: 'pendiente', total: 17220 }, { status: 201 });
      })
    );

    await crearPedido(4, ITEMS);

    expect(cuerpo).toEqual({ mesaId: 4, items: ITEMS });
  });

  test('si es para la barra no manda mesaId', async () => {
    let cuerpo: unknown;
    server.use(
      http.post(`${API_URL}/pedidos`, async ({ request }) => {
        cuerpo = await request.json();
        return HttpResponse.json({ id: 1, mesaId: null, items: ITEMS, estado: 'pendiente', total: 17220 }, { status: 201 });
      })
    );

    await crearPedido(undefined, ITEMS);

    expect(cuerpo).toEqual({ items: ITEMS });
    expect(cuerpo).not.toHaveProperty('mesaId');
  });

  test('si la API rechaza el pedido, lanza ErrorDeApi con su mensaje y su código', async () => {
    const error = await crearPedido(99, ITEMS).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ErrorDeApi);
    expect(error).toMatchObject({ message: 'Mesa 99 no encontrada', status: 404 });
  });
});

describe('obtenerPedido', () => {
  test('devuelve el pedido con su estado actual', async () => {
    await crearPedido(4, ITEMS);

    const pedido = await obtenerPedido(1);

    expect(pedido).toMatchObject({ id: 1, mesaId: 4, estado: 'pendiente', total: 17220 });
  });

  test('si el pedido no existe, lanza ErrorDeApi 404', async () => {
    const error = await obtenerPedido(42).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ErrorDeApi);
    expect(error).toMatchObject({ message: 'Pedido 42 no encontrado', status: 404 });
  });
});
