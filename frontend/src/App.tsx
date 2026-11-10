import { CargaDelMenu } from './componentes/CargaDelMenu';
import { Carrito } from './componentes/Carrito';
import { Confirmacion } from './componentes/Confirmacion';
import { Encabezado } from './componentes/Encabezado';
import { ErrorDelPedido } from './componentes/ErrorDelPedido';
import { CarritoProvider } from './carrito/CarritoProvider';
import { useCarrito } from './carrito/useCarrito';
import { leerMesa } from './dominio/mesa';
import { useMenu } from './menu/useMenu';
import { usePedido } from './pedido/usePedido';
import { Pasteleria } from './componentes/Pasteleria';
import { SelectorCafe } from './componentes/SelectorCafe';

function ContenidoApp() {
  const { menu, reintentar } = useMenu();
  const { items, vaciar, agregar } = useCarrito();
  const { envio, confirmar, actualizar } = usePedido(vaciar);

  const mesaId = leerMesa(window.location.search);

  const handleConfirmar = () => {
    const itemsDelPedido = items.map((i) => ({
      productoId: i.producto.id,
      cantidad: i.cantidad,
    }));
    void confirmar(mesaId ?? undefined, itemsDelPedido);
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
        {envio.estado === 'error' && <ErrorDelPedido mensaje={envio.mensaje} />}

        <CargaDelMenu menu={menu} onReintentar={reintentar}>
          {(productos) => (
          <>
            <SelectorCafe productos={productos} onAgregar={agregar} />
            <div className="mt-4">
              <Pasteleria productos={productos} onAgregar={agregar} />
            </div>
          </>
          )}
        </CargaDelMenu>

        <Carrito onConfirmar={handleConfirmar} confirmando={envio.estado === 'enviando'} />

        {envio.estado === 'confirmado' && (
          <div className="mt-4">
            <Confirmacion
              pedido={envio.pedido}
              onActualizar={() => void actualizar()}
              actualizando={envio.actualizando}
              errorAlActualizar={envio.errorAlActualizar}
            />
          </div>
        )}
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