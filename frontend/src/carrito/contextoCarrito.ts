import { createContext } from 'react';
import type { Producto } from '../api/esquemas';
import type { ItemCarrito } from './carritoReducer';

export interface ContextoCarritoType {
    items: ItemCarrito[];
    subtotal: number;
    agregar: (producto: Producto) => void;
    sumar: (productoId: number) => void;
    restar: (productoId: number) => void;
    sacar: (productoId: number) => void;
    vaciar: () => void;
}

export const CarritoContext = createContext<ContextoCarritoType | undefined>(undefined);
