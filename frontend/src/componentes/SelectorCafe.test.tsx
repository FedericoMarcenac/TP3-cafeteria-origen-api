import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { productosSchema } from '../api/esquemas';
import { productosDeLaApi } from '../mocks/datos';
import { SelectorCafe } from './SelectorCafe';

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
});