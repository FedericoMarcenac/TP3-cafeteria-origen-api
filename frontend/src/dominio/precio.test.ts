import { describe, it, expect } from 'vitest';
import { formatearPrecio } from './precio';

describe('formatearPrecio', () => {
  it('formatea un precio chico sin separador', () => {
    expect(formatearPrecio(500)).toBe('$500');
  });
});