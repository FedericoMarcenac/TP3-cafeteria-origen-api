import { describe, it, expect } from 'vitest';
import { formatearPrecio } from './precio';

describe('formatearPrecio', () => {
  it('formatea un precio chico sin separador', () => {
    expect(formatearPrecio(500)).toBe('$500');
  });
  
  it('separa los miles con punto', () => {
    expect(formatearPrecio(7360)).toBe('$7.360');
    expect(formatearPrecio(11140)).toBe('$11.140');
  });
});