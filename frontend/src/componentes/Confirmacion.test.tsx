import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
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
    render(<Confirmacion pedido={pedido} onActualizar={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Pedido #2' })).toBeInTheDocument();
    expect(screen.getByText('pendiente')).toBeInTheDocument();
    expect(screen.getByText('$17.220')).toBeInTheDocument();
  });

  test('muestra el estado en preparación con tilde y espacio', () => {
    render(<Confirmacion pedido={{ ...pedido, estado: 'en_preparacion' }} onActualizar={vi.fn()} />);

    expect(screen.getByText('en preparación')).toBeInTheDocument();
  });

  test('el botón Actualizar estado pide consultar el pedido', async () => {
    const onActualizar = vi.fn();
    render(<Confirmacion pedido={pedido} onActualizar={onActualizar} />);

    await userEvent.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(onActualizar).toHaveBeenCalledTimes(1);
  });

  test('mientras actualiza el botón queda deshabilitado', () => {
    render(<Confirmacion pedido={pedido} onActualizar={vi.fn()} actualizando />);

    expect(screen.getByRole('button', { name: 'Actualizar estado' })).toBeDisabled();
  });

  test('si falló al actualizar muestra el mensaje y sigue mostrando el pedido', () => {
    render(<Confirmacion pedido={pedido} onActualizar={vi.fn()} errorAlActualizar="Pedido 2 no encontrado" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Pedido 2 no encontrado');
    expect(screen.getByText('pendiente')).toBeInTheDocument();
  });

  test('sin error no hay alerta', () => {
    render(<Confirmacion pedido={pedido} onActualizar={vi.fn()} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
