import React, { createContext, useContext, useReducer } from 'react';
import { carritoReducer, EstadoCarrito, ItemCarrito } from './carritoReducer';
import { Producto } from '../api/esquemas';

interface ContextoCarritoType {
    items: ItemCarrito[];
    subtotal: number;
    agregar: (producto: Producto) => void;
    sumar: (productoId: number) => void;
    restar: (productoId: number) => void;
    sacar: (productoId: number) => void;
    vaciar: () => void;
}

const CarritoContext = createContext<ContextoCarritoType | undefined>(undefined);

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

export const useCarrito = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
    }
    return context;
};