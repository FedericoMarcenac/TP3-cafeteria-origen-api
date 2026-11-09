import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Carrito } from './Carrito';
import { CarritoProvider, useCarrito } from '../carrito/CarritoContext';

const productoMock = { id: 5, tipo: 'expreso', nombre: 'Expreso Mediano', precio: 7360 };

// Componente helper para precargar el contexto en el test
const BotonAgregarHelper = () => {
    const { agregar } = useCarrito();
    return <button onClick={() => agregar(productoMock)}>Agregar Mock</button>;
};

describe('Componente Carrito', () => {
    it('muestra el estado vacío y deshabilita el botón de confirmar', () => {
        const handleConfirmar = vi.fn();
        render(
        <CarritoProvider>
            <Carrito onConfirmar={handleConfirmar} />
        </CarritoProvider>
        );

        expect(screen.getByText(/tu pedido está vacío/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirmar pedido/i })).toBeDisabled();
    });

    it('permite sumar, restar y modificar cantidades', async () => {
        const handleConfirmar = vi.fn();
        const user = userEvent.setup();

        render(
            <CarritoProvider>
                <BotonAgregarHelper />
                <Carrito onConfirmar={handleConfirmar} />
            </CarritoProvider>
        );

        // Agregamos un producto
        await user.click(screen.getByText('Agregar Mock'));
        expect(screen.getByText('Expreso Mediano')).toBeInTheDocument();

        // Sumar uno
        const botonSumar = screen.getByLabelText(/sumar uno de expreso mediano/i);
        await user.click(botonSumar);
        expect(screen.getByText('$14720')).toBeInTheDocument();

        // Restar uno
        const botonRestar = screen.getByLabelText(/restar uno de expreso mediano/i);
        await user.click(botonRestar);
        expect(screen.getByText('$7360')).toBeInTheDocument();
    });
});