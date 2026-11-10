import React, { useState } from 'react';
import { CargaDelMenu } from './componentes/CargaDelMenu';
import { Encabezado } from './componentes/Encabezado';
import { leerMesa } from './dominio/mesa';
import { useMenu } from './menu/useMenu';
import { CarritoProvider } from './carrito/CarritoProvider';
import { useCarrito } from './carrito/useCarrito';
import { Carrito } from './componentes/Carrito';
import { crearPedido } from './api/cliente';
import { Pedido } from './api/esquemas';

function ContenidoApp() {
  const { menu, reintentar } = useMenu();
  const { items, vaciar } = useCarrito();
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mesaId = leerMesa(window.location.search);

  const handleConfirmar = async () => {
    setConfirmando(true);
    setError(null);
    try {
      const itemsPayload = items.map((i) => ({
        productoId: i.producto.id,
        cantidad: i.cantidad,
      }));
      const nuevoPedido = await crearPedido(mesaId, itemsPayload);
      setPedidoConfirmado(nuevoPedido);
      vaciar();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al enviar el pedido');
      }
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <>
      <header className="encabezado py-3">
        <div className="container">
          <h1 className="h4 mb-0">Cafetería Origen</h1>
          <Encabezado mesa={mesaId} />
        </div>
      </header>
      <main className="container py-3" style={{ maxWidth: '375px' }}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <CargaDelMenu menu={menu} onReintentar={reintentar}>
          {(productos) => (
            <section aria-labelledby="titulo-menu">
              <h2 id="titulo-menu" className="h5">
                Menú
              </h2>
              <ul className="list-group">
                {productos.map((producto) => (
                  <li key={producto.id} className="list-group-item">
                    {producto.nombre}
                  </li>
                ))}
              </ul>
            </section>

          )}
        </CargaDelMenu>

        {/* Tu componente de Carrito */}
        <Carrito onConfirmar={handleConfirmar} confirmando={confirmando} />
      </main>
    </>
  );
}

export function App() {
  return (
    <CarritoProvider>
      <ContenidoApp />
    </CarritoProvider>
  );
}