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

  it('distingue el filtrado por tipo y encuentra taza grande de Etiopía', () => {
    const cafe = buscarCafe(productos, {
      bebida: 'filtrado',
      tamanio: 'Taza grande',
      origen: 'Etiopía',
    });
    expect(cafe?.id).toBe(18);
  });

  it('devuelve undefined si la elección está incompleta', () => {
    const cafe = buscarCafe(productos, {
      bebida: 'expreso',
      tamanio: 'Mediano',
    });
    expect(cafe).toBeUndefined();
  });
});