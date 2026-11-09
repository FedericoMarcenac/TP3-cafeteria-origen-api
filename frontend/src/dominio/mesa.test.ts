import { describe, it, expect } from 'vitest';
import { leerMesa } from './mesa';

describe('leerMesa', () => {
  it('devuelve el número de mesa cuando es válido', () => {
    expect(leerMesa('?mesa=4')).toBe(4);
  });
});