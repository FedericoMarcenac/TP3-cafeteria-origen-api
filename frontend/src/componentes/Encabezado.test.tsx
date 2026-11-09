import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Encabezado } from './Encabezado';

describe('Encabezado', () => {
  it('muestra el número de mesa', () => {
    render(<Encabezado mesa={4} />);
    expect(screen.getByText('Mesa 4')).toBeInTheDocument();
  });
});