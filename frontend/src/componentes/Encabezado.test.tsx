import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Encabezado } from './Encabezado';

describe('Encabezado', () => {
  it('muestra "Para retirar en la barra" cuando no hay mesa', () => {
    render(<Encabezado mesa={null} />);
    expect(screen.getByText('Para retirar en la barra')).toBeInTheDocument();
  });
});