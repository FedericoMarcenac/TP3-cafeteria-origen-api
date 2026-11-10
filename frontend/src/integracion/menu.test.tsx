import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';
import { App } from '../App';
import { API_URL } from '../api/config';
import { productosDeLaApi } from '../mocks/datos';
import { server } from '../mocks/server';

const URL_PRODUCTOS = `${API_URL}/productos`;

describe('Carga del menú desde la API', () => {
  test('muestra un indicador mientras carga y después los productos', async () => {
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Cargando el menú…');
    expect(await screen.findByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Armá tu café' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('si la API responde 500 muestra el error y Reintentar vuelve a pedir el menú', async () => {
    let pedidos = 0;
    server.use(
      http.get(URL_PRODUCTOS, () => {
        pedidos += 1;
        return pedidos === 1
          ? HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
          : HttpResponse.json(productosDeLaApi);
      })
    );
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Error interno del servidor');
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(pedidos).toBe(2);
  });

  test('si la API está caída avisa que no se pudo conectar', async () => {
    server.use(http.get(URL_PRODUCTOS, () => HttpResponse.error()));
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con el servidor');
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  test('si la respuesta no cumple el contrato muestra un error en lugar del menú', async () => {
    server.use(
      http.get(URL_PRODUCTOS, () =>
        HttpResponse.json(productosDeLaApi.map((producto) => ({ ...producto, precio: String(producto.precio) })))
      )
    );
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('El servidor respondió con datos que no esperábamos');
    expect(screen.queryByText('Muffin de chocolate')).not.toBeInTheDocument();
  });
});
