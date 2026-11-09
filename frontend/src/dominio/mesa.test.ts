import { describe, it, expect } from 'vitest';
import { leerMesa } from './mesa';

describe('leerMesa', () => {
  it('devuelve el número de mesa cuando es válido', () => {
    expect(leerMesa('?mesa=4')).toBe(4);
  });

  it('devuelve null si no hay parámetro mesa', () => {
    expect(leerMesa('')).toBeNull();
  });

  it.each(['?mesa=abc', '?mesa=0', '?mesa=-2', '?mesa=4.5'])(
    'devuelve null con %s',
    (search) => {
      expect(leerMesa(search)).toBeNull();
    }
  );
});