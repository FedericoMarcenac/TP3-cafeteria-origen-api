import React, { useReducer } from 'react';
import type { Producto } from '../api/esquemas';
import { carritoReducer } from './carritoReducer';
import { CarritoContext } from './contextoCarrito';

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [estado, dispatch] = useReducer(carritoReducer, { items: [] });

    const subtotal = estado.items.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);

    const agregar = (producto: Producto) => dispatch({ type: 'AGREGAR', producto });
    const sumar = (productoId: number) => dispatch({ type: 'SUMAR', productoId });
    const restar = (productoId: number) => dispatch({ type: 'RESTAR', productoId });
    const sacar = (productoId: number) => dispatch({ type: 'SACAR', productoId });
    const vaciar = () => dispatch({ type: 'VACIAR' });

    return (
        <CarritoContext.Provider value={{ items: estado.items, subtotal, agregar, sumar, restar, sacar, vaciar }}>
        {children}
        </CarritoContext.Provider>
    );
};
