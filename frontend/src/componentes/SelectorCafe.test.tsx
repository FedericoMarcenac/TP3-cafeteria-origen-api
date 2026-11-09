import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { productosSchema } from '../api/esquemas';
import { productosDeLaApi } from '../mocks/datos';
import { SelectorCafe } from './SelectorCafe';
import userEvent from '@testing-library/user-event';

const productos = productosSchema.parse(productosDeLaApi);

describe('SelectorCafe', () => {
  it('muestra los grupos Bebida, Tamaño y Origen con sus opciones', () => {
    render(<SelectorCafe productos={productos} onAgregar={() => {}} />);

    expect(screen.getByRole('group', { name: 'Bebida' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Expreso' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Filtrado' })).toBeInTheDocument();

    expect(screen.getByRole('group', { name: 'Tamaño' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Pocillo' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Mediano' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Taza grande' })).toBeInTheDocument();

    expect(screen.getByRole('group', { name: 'Origen' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Colombia' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Etiopía' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Brasil' })).toBeInTheDocument();
  });

  it('arranca con el botón Agregar al pedido deshabilitado', () => {
    render(<SelectorCafe productos={productos} onAgregar={() => {}} />);

    expect(
      screen.getByRole('button', { name: 'Agregar al pedido' }),
    ).toBeDisabled();
  });

  it('habilita el botón recién cuando se eligen bebida, tamaño y origen', async () => {
    const user = userEvent.setup();
    render(<SelectorCafe productos={productos} onAgregar={() => {}} />);
    const boton = screen.getByRole('button', { name: 'Agregar al pedido' });

    await user.click(screen.getByRole('radio', { name: 'Expreso' }));
    expect(boton).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: 'Mediano' }));
    expect(boton).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: 'Colombia' }));
    expect(boton).toBeEnabled();
  });

  it('al agregar llama a onAgregar con el producto elegido', async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();
    render(<SelectorCafe productos={productos} onAgregar={onAgregar} />);

    await user.click(screen.getByRole('radio', { name: 'Expreso' }));
    await user.click(screen.getByRole('radio', { name: 'Mediano' }));
    await user.click(screen.getByRole('radio', { name: 'Colombia' }));
    await user.click(screen.getByRole('button', { name: 'Agregar al pedido' }));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(expect.objectContaining({ id: 5 }));
  });

  it('muestra la descripción de cada origen que viene de la API', () => {
    render(<SelectorCafe productos={productos} onAgregar={() => {}} />);

    for (const origen of ['Colombia', 'Etiopía', 'Brasil']) {
      let descripcion: string | undefined;
      for (const p of productos) {
        if (p.tipo !== 'pasteleria' && p.variedad.nombre === origen) {
          descripcion = p.variedad.descripcion;
          break;
        }
      }
      if (!descripcion) throw new Error(`No hay descripción para ${origen}`);

      expect(screen.getByText(descripcion)).toBeInTheDocument();
    }
  });
});