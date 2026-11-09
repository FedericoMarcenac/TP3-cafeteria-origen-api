import { describe, it, expect } from 'vitest';
import { carritoReducer, EstadoCarrito } from './carritoReducer';
import { Producto } from '../api/esquemas';

const productoEjemplo: Producto = {
    id: 5,
    tipo: 'expreso',
    nombre: 'Expreso Mediano',
    precio: 7360
};

describe('carritoReducer', () => {
    const estadoInicial: EstadoCarrito = { items: [] };

    it('debe agregar un nuevo producto al carrito', () => {
        const nuevoEstado = carritoReducer(estadoInicial, { type: 'AGREGAR', producto: productoEjemplo });
        expect(nuevoEstado.items).toHaveLength(1);
        expect(nuevoEstado.items[0]).toEqual({ producto: productoEjemplo, cantidad: 1 });
    });

    it('debe incrementar la cantidad si el producto ya existe', () => {
        const estadoConItem = { items: [{ producto: productoEjemplo, cantidad: 1 }] };
        const nuevoEstado = carritoReducer(estadoConItem, { type: 'AGREGAR', producto: productoEjemplo });
        expect(nuevoEstado.items[0].cantidad).toBe(2);
    });

    it('debe restar la cantidad y eliminar el item si llega a cero', () => {
        const estadoConItem = { items: [{ producto: productoEjemplo, cantidad: 1 }] };
        const nuevoEstado = carritoReducer(estadoConItem, { type: 'RESTAR', productoId: 5 });
        expect(nuevoEstado.items).toHaveLength(0);
    });

    it('debe vaciar el carrito por completo', () => {
        const estadoConItem = { items: [{ producto: productoEjemplo, cantidad: 3 }] };
        const nuevoEstado = carritoReducer(estadoConItem, { type: 'VACIAR' });
        expect(nuevoEstado.items).toHaveLength(0);
    });
});