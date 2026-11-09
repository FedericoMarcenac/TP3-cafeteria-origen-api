import { describe, expect, test } from 'vitest';
import { productosDeLaApi } from '../mocks/datos';
import { errorSchema, pedidoSchema, productoSchema, productosSchema } from './esquemas';

const expresoMedianoColombia = {
  id: 5,
  tipo: 'expreso',
  nombre: 'Expreso Mediano Colombia',
  precioBase: 2500,
  precio: 7360,
  tamanio: 'Mediano',
  variedad: {
    nombre: 'Colombia',
    descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
  },
  gramos: 27,
  costoCafe: 4860,
};

const muffin = { id: 19, tipo: 'pasteleria', nombre: 'Muffin de chocolate', precioBase: 2500, precio: 2500 };

const pedidoDeLaMesa4 = {
  id: 2,
  mesaId: 4,
  items: [
    { productoId: 5, cantidad: 2 },
    { productoId: 19, cantidad: 1 },
  ],
  estado: 'pendiente',
  total: 17220,
};

describe('productoSchema', () => {
  test('acepta un café tal como lo devuelve la API', () => {
    expect(productoSchema.parse(expresoMedianoColombia)).toMatchObject({
      id: 5,
      tipo: 'expreso',
      precio: 7360,
      tamanio: 'Mediano',
      variedad: { nombre: 'Colombia' },
    });
  });

  test('acepta la pastelería, que no trae datos de café', () => {
    expect(productoSchema.parse(muffin)).toEqual({ id: 19, tipo: 'pasteleria', nombre: 'Muffin de chocolate', precio: 2500 });
  });

  test('rechaza un precio en texto', () => {
    expect(productoSchema.safeParse({ ...expresoMedianoColombia, precio: '7360' }).success).toBe(false);
  });

  test('rechaza un tipo que no es expreso, filtrado ni pastelería', () => {
    expect(productoSchema.safeParse({ ...muffin, tipo: 'te' }).success).toBe(false);
  });

  test('rechaza un café sin variedad', () => {
    expect(productoSchema.safeParse({ ...expresoMedianoColombia, variedad: undefined }).success).toBe(false);
  });

  test('rechaza un tamaño desconocido', () => {
    expect(productoSchema.safeParse({ ...expresoMedianoColombia, tamanio: 'Jarra' }).success).toBe(false);
  });
});

describe('productosSchema', () => {
  test('acepta los 20 productos del menú', () => {
    expect(productosSchema.parse(productosDeLaApi)).toHaveLength(20);
  });
});

describe('pedidoSchema', () => {
  test('acepta el pedido de la mesa 4', () => {
    expect(pedidoSchema.parse(pedidoDeLaMesa4)).toEqual(pedidoDeLaMesa4);
  });

  test('acepta un pedido para retirar en la barra', () => {
    expect(pedidoSchema.parse({ ...pedidoDeLaMesa4, mesaId: null }).mesaId).toBeNull();
  });

  test('rechaza un pedido sin total', () => {
    expect(pedidoSchema.safeParse({ ...pedidoDeLaMesa4, total: undefined }).success).toBe(false);
  });

  test('rechaza un estado desconocido', () => {
    expect(pedidoSchema.safeParse({ ...pedidoDeLaMesa4, estado: 'perdido' }).success).toBe(false);
  });
});

describe('errorSchema', () => {
  test('lee el mensaje de error de la API', () => {
    expect(errorSchema.parse({ error: 'Mesa 99 no encontrada' }).error).toBe('Mesa 99 no encontrada');
  });
});
