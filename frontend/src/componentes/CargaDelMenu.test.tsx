import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import type { Producto } from '../api/esquemas';
import { CargaDelMenu } from './CargaDelMenu';

const productos: Producto[] = [
  { id: 19, tipo: 'pasteleria', nombre: 'Muffin de chocolate', precio: 2500 },
  { id: 20, tipo: 'pasteleria', nombre: 'Torta selva negra', precio: 4200 },
];

function listar(lista: Producto[]) {
  return (
    <ul>
      {lista.map((producto) => (
        <li key={producto.id}>{producto.nombre}</li>
      ))}
    </ul>
  );
}

describe('CargaDelMenu', () => {
  test('mientras carga muestra un indicador y todavía no el menú', () => {
    render(
      <CargaDelMenu menu={{ estado: 'cargando' }} onReintentar={vi.fn()}>
        {listar}
      </CargaDelMenu>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Cargando el menú…');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('si falló muestra el mensaje en lugar del menú', () => {
    render(
      <CargaDelMenu menu={{ estado: 'error', mensaje: 'Error interno del servidor' }} onReintentar={vi.fn()}>
        {listar}
      </CargaDelMenu>
    );

    const alerta = screen.getByRole('alert');
    expect(alerta).toHaveTextContent('No pudimos cargar el menú');
    expect(alerta).toHaveTextContent('Error interno del servidor');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('el botón Reintentar pide volver a cargar', async () => {
    const onReintentar = vi.fn();
    render(
      <CargaDelMenu menu={{ estado: 'error', mensaje: 'Error interno del servidor' }} onReintentar={onReintentar}>
        {listar}
      </CargaDelMenu>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onReintentar).toHaveBeenCalledTimes(1);
  });

  test('cuando está listo muestra el menú con los productos', () => {
    render(
      <CargaDelMenu menu={{ estado: 'listo', productos }} onReintentar={vi.fn()}>
        {listar}
      </CargaDelMenu>
    );

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Muffin de chocolate',
      'Torta selva negra',
    ]);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
