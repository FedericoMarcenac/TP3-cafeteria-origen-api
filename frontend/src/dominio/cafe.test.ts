import { describe, it, expect } from 'vitest';
import { productosSchema } from '../api/esquemas';
import { productosDeLaApi } from '../mocks/datos';
import { buscarCafe } from './cafe';

const productos = productosSchema.parse(productosDeLaApi);

describe('buscarCafe', () => {
  it('encuentra el expreso mediano de Colombia', () => {
    const cafe = buscarCafe(productos, {
      bebida: 'expreso',
      tamanio: 'Mediano',
      origen: 'Colombia',
    });
    expect(cafe?.id).toBe(5);
  });
});