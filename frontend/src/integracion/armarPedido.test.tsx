import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, test } from 'vitest';
import { App } from '../App';
import { API_URL } from '../api/config';
import { server } from '../mocks/server';

type Usuario = ReturnType<typeof userEvent.setup>;

const ITEMS_ESPERADOS = [
  { productoId: 5, cantidad: 1 },
  { productoId: 19, cantidad: 1 },
];

async function armarExpresoYMuffin(user: Usuario) {
  await user.click(await screen.findByRole('radio', { name: 'Expreso' }));
  await user.click(screen.getByRole('radio', { name: 'Mediano' }));
  await user.click(screen.getByRole('radio', { name: 'Colombia' }));
  await user.click(screen.getByRole('button', { name: 'Agregar al pedido' }));
  await user.click(screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }));
}

afterEach(() => window.history.replaceState(null, '', '/'));

describe('Armar y confirmar el pedido desde la App', () => {
  test('el café armado en tres pasos y la pastelería quedan en el carrito', async () => {
    const user = userEvent.setup();
    render(<App />);

    await armarExpresoYMuffin(user);

    expect(screen.getByRole('button', { name: 'Sacar Expreso Mediano Colombia' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sacar Muffin de chocolate' })).toBeInTheDocument();
    expect(screen.getByText('$9.860')).toBeInTheDocument();
  });

  test('confirma con la mesa del QR y muestra el número y el estado del pedido', async () => {
    window.history.replaceState(null, '', '/?mesa=4');
    let cuerpo: unknown;
    server.use(
      http.post(`${API_URL}/pedidos`, async ({ request }) => {
        cuerpo = await request.json();
        return HttpResponse.json(
          { id: 2, mesaId: 4, items: ITEMS_ESPERADOS, estado: 'pendiente', total: 9860 },
          { status: 201 }
        );
      })
    );
    const user = userEvent.setup();
    render(<App />);

    await armarExpresoYMuffin(user);
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByRole('heading', { name: 'Pedido #2' })).toBeInTheDocument();
    expect(cuerpo).toEqual({ mesaId: 4, items: ITEMS_ESPERADOS });
    expect(screen.getByText('pendiente')).toBeInTheDocument();
    expect(screen.getByText('Tu pedido está vacío')).toBeInTheDocument();
  });
});
