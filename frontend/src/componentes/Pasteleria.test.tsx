import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { productosSchema } from '../api/esquemas';
import { productosDeLaApi } from '../mocks/datos';
import { Pasteleria } from './Pasteleria';

const productos = productosSchema.parse(productosDeLaApi);

describe('Pasteleria', () => {
  it('muestra el muffin y la torta con sus precios', () => {
    render(<Pasteleria productos={productos} onAgregar={() => {}} />);

    expect(screen.getByText(/muffin de chocolate/i)).toBeInTheDocument();
    expect(screen.getByText('$2.500')).toBeInTheDocument();
    expect(screen.getByText(/torta selva negra/i)).toBeInTheDocument();
    expect(screen.getByText('$4.200')).toBeInTheDocument();
  });
});