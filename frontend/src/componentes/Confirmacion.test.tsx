import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import type { Pedido } from '../api/esquemas';
import { Confirmacion } from './Confirmacion';

const pedido: Pedido = {
  id: 2,
  mesaId: 4,
  items: [
    { productoId: 5, cantidad: 2 },
    { productoId: 19, cantidad: 1 },
  ],
  estado: 'pendiente',
  total: 17220,
};

describe('Confirmacion', () => {
  test('muestra el número de pedido, el estado y el total de la API', () => {
    render(<Confirmacion pedido={pedido} />);

    expect(screen.getByRole('heading', { name: 'Pedido #2' })).toBeInTheDocument();
    expect(screen.getByText('pendiente')).toBeInTheDocument();
    expect(screen.getByText('$17.220')).toBeInTheDocument();
  });

  test('muestra el estado en preparación con tilde y espacio', () => {
    render(<Confirmacion pedido={{ ...pedido, estado: 'en_preparacion' }} />);

    expect(screen.getByText('en preparación')).toBeInTheDocument();
  });
});
