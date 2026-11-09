import React from 'react';
import { useCarrito } from '../carrito/CarritoContext';

interface CarritoProps {
    onConfirmar: () => void;
    confirmando?: boolean;
}

export const Carrito: React.FC<CarritoProps> = ({ onConfirmar, confirmando = false }) => {
    const { items, subtotal, sumar, restar, sacar } = useCarrito();

    if (items.length === 0) {
        return (
        <section className="carrito card p-3 mt-4">
            <h2>Tu pedido</h2>
            <p>Tu pedido está vacío</p>
            <button className="btn btn-primary" disabled>
            Confirmar pedido
            </button>
        </section>
        );
    }

    return (
        <section className="carrito card p-3 mt-4">
        <h2>Tu pedido</h2>
        <ul className="list-group list-group-flush mb-3">
            {items.map(({ producto, cantidad }) => (
            <li key={producto.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                <strong>{producto.nombre}</strong>
                <div>Subtotal: ${producto.precio * cantidad}</div>
                </div>
                <div className="btn-group role-group">
                <button
                    className="btn btn-sm btn-outline-secondary"
                    aria-label={`Restar uno de ${producto.nombre}`}
                    onClick={() => restar(producto.id)}
                >
                    -
                </button>
                <span className="btn btn-sm disabled">{cantidad}</span>
                <button
                    className="btn btn-sm btn-outline-secondary"
                    aria-label={`Sumar uno de ${producto.nombre}`}
                    onClick={() => sumar(producto.id)}
                >
                    +
                </button>
                <button
                    className="btn btn-sm btn-outline-danger"
                    aria-label={`Sacar ${producto.nombre}`}
                    onClick={() => sacar(producto.id)}
                >
                    &times;
                </button>
                </div>
            </li>
            ))}
        </ul>
        <div className="mb-3">
            <small className="text-muted d-block">Subtotal orientativo:</small>
            <strong>${subtotal}</strong>
        </div>
        <button className="btn btn-primary w-100" onClick={onConfirmar} disabled={confirmando}>
            {confirmando ? 'Enviando...' : 'Confirmar pedido'}
        </button>
        </section>
    );
};