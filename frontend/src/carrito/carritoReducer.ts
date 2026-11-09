import { Producto } from '../api/esquemas';

export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

export interface EstadoCarrito {
    items: ItemCarrito[];
}

export type AccionCarrito =
    | { type: 'AGREGAR'; producto: Producto }
    | { type: 'SUMAR'; productoId: number }
    | { type: 'RESTAR'; productoId: number }
    | { type: 'SACAR'; productoId: number }
    | { type: 'VACIAR' };

export function carritoReducer(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
    switch (accion.type) {
        case 'AGREGAR': {
        const existe = estado.items.find(i => i.producto.id === accion.producto.id);
        if (existe) {
            return {
            ...estado,
            items: estado.items.map(i =>
                i.producto.id === accion.producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
            )
            };
        }
        return { ...estado, items: [...estado.items, { producto: accion.producto, cantidad: 1 }] };
        }
        case 'SUMAR': {
        return {
            ...estado,
            items: estado.items.map(i =>
            i.producto.id === accion.productoId ? { ...i, cantidad: i.cantidad + 1 } : i
            )
        };
        }
        case 'RESTAR': {
        return {
            ...estado,
            items: estado.items
            .map(i => (i.producto.id === accion.productoId ? { ...i, cantidad: i.cantidad - 1 } : i))
            .filter(i => i.cantidad > 0)
        };
        }
        case 'SACAR': {
        return {
            ...estado,
            items: estado.items.filter(i => i.producto.id !== accion.productoId)
        };
        }
        case 'VACIAR': {
        return { items: [] };
        }
        default:
        return estado;
    }
}