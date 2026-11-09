import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { ErrorDelPedido } from './ErrorDelPedido';

describe('ErrorDelPedido', () => {
  test('muestra en una alerta el mensaje que devolvió la API', () => {
    render(<ErrorDelPedido mensaje="Mesa 99 no encontrada" />);

    const alerta = screen.getByRole('alert');
    expect(alerta).toHaveTextContent('No pudimos enviar tu pedido');
    expect(alerta).toHaveTextContent('Mesa 99 no encontrada');
  });
});
