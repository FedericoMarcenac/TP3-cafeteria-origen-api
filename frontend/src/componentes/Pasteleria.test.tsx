import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { productosSchema } from '../api/esquemas';
import { productosDeLaApi } from '../mocks/datos';
import { Pasteleria } from './Pasteleria';
import userEvent from '@testing-library/user-event';

const productos = productosSchema.parse(productosDeLaApi);

describe('Pasteleria', () => {
  it('muestra el muffin y la torta con sus precios', () => {
    render(<Pasteleria productos={productos} onAgregar={() => {}} />);

    expect(screen.getByText(/muffin de chocolate/i)).toBeInTheDocument();
    expect(screen.getByText('$2.500')).toBeInTheDocument();
    expect(screen.getByText(/torta selva negra/i)).toBeInTheDocument();
    expect(screen.getByText('$4.200')).toBeInTheDocument();
  });

   it('al tocar Agregar Muffin de chocolate llama a onAgregar con ese producto', async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();
    render(<Pasteleria productos={productos} onAgregar={onAgregar} />);

    await user.click(
      screen.getByRole('button', { name: /agregar muffin de chocolate/i }),
    );

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(expect.objectContaining({ id: 19 }));
  }); 

});