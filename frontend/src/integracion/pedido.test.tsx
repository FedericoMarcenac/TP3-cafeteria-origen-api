import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import type { ItemPedido } from '../api/esquemas';
import { API_URL } from '../api/config';
import { Confirmacion } from '../componentes/Confirmacion';
import { ErrorDelPedido } from '../componentes/ErrorDelPedido';
import { server } from '../mocks/server';
import { usePedido } from '../pedido/usePedido';

const ITEMS: ItemPedido[] = [
  { productoId: 5, cantidad: 2 },
  { productoId: 19, cantidad: 1 },
];

/**
 * Arma el flujo del pedido con las piezas reales (hook, componentes y cliente HTTP) y un carrito mínimo.
 * Cuando el carrito de Ramiro esté en main, se puede reemplazar por <App /> sin tocar los tests.
 */
function PedidoDePrueba({ mesaId }: { mesaId?: number }) {
  const [items, setItems] = useState<ItemPedido[]>(ITEMS);
  const { envio, confirmar, actualizar } = usePedido(() => setItems([]));

  return (
    <>
      <p>{items.length === 0 ? 'Tu pedido está vacío' : `Productos en el carrito: ${items.length}`}</p>
      <button
        type="button"
        disabled={items.length === 0 || envio.estado === 'enviando'}
        onClick={() => void confirmar(mesaId, items)}
      >
        Confirmar pedido
      </button>
      {envio.estado === 'error' && <ErrorDelPedido mensaje={envio.mensaje} />}
      {envio.estado === 'confirmado' && (
        <Confirmacion
          pedido={envio.pedido}
          onActualizar={() => void actualizar()}
          actualizando={envio.actualizando}
          errorAlActualizar={envio.errorAlActualizar}
        />
      )}
    </>
  );
}

describe('Confirmar y seguir el pedido', () => {
  test('envía el pedido completo, muestra la confirmación y vacía el carrito', async () => {
    let cuerpo: unknown;
    server.use(
      http.post(`${API_URL}/pedidos`, async ({ request }) => {
        cuerpo = await request.json();
        return HttpResponse.json(
          { id: 2, mesaId: 4, items: ITEMS, estado: 'pendiente', total: 17220 },
          { status: 201 }
        );
      })
    );
    render(<PedidoDePrueba mesaId={4} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByRole('heading', { name: 'Pedido #2' })).toBeInTheDocument();
    expect(cuerpo).toEqual({ mesaId: 4, items: ITEMS });
    expect(screen.getByText('pendiente')).toBeInTheDocument();
    expect(screen.getByText('Tu pedido está vacío')).toBeInTheDocument();
  });

  test('muestra el total que devolvió la API, no uno calculado por el front', async () => {
    server.use(
      http.post(`${API_URL}/pedidos`, () =>
        HttpResponse.json({ id: 2, mesaId: 4, items: ITEMS, estado: 'pendiente', total: 12345 }, { status: 201 })
      )
    );
    render(<PedidoDePrueba mesaId={4} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByText('$12.345')).toBeInTheDocument();
    expect(screen.queryByText('$17.220')).not.toBeInTheDocument();
  });

  test('si la API rechaza el pedido (4xx) muestra su mensaje y conserva el carrito', async () => {
    render(<PedidoDePrueba mesaId={99} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Mesa 99 no encontrada');
    expect(screen.getByText('Productos en el carrito: 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeEnabled();
    expect(screen.queryByRole('heading', { name: /Pedido #/ })).not.toBeInTheDocument();
  });

  test('si la API está caída avisa y conserva el carrito', async () => {
    server.use(http.post(`${API_URL}/pedidos`, () => HttpResponse.error()));
    render(<PedidoDePrueba mesaId={4} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con el servidor');
    expect(screen.getByText('Productos en el carrito: 2')).toBeInTheDocument();
  });

  test('Actualizar estado muestra que el pedido pasó de pendiente a en preparación, sin recargar', async () => {
    render(<PedidoDePrueba mesaId={4} />);
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    expect(await screen.findByText('pendiente')).toBeInTheDocument();
    server.use(
      http.get(`${API_URL}/pedidos/:id`, () =>
        HttpResponse.json({ id: 1, mesaId: 4, items: ITEMS, estado: 'en_preparacion', total: 17220 })
      )
    );

    await userEvent.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await screen.findByText('en preparación')).toBeInTheDocument();
    expect(screen.queryByText('pendiente')).not.toBeInTheDocument();
  });

  test('si falla al actualizar el estado, muestra el error y sigue mostrando el pedido', async () => {
    render(<PedidoDePrueba mesaId={4} />);
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    expect(await screen.findByText('pendiente')).toBeInTheDocument();
    server.use(http.get(`${API_URL}/pedidos/:id`, () => HttpResponse.json({ error: 'Pedido 1 no encontrado' }, { status: 404 })));

    await userEvent.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Pedido 1 no encontrado');
    expect(screen.getByText('pendiente')).toBeInTheDocument();
  });
});
