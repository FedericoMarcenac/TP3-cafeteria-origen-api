import { CargaDelMenu } from './componentes/CargaDelMenu';
import { Encabezado } from './componentes/Encabezado';
import { leerMesa } from './dominio/mesa';
import { useMenu } from './menu/useMenu';

export function App() {
  const { menu, reintentar } = useMenu();
  const mesa = leerMesa(window.location.search);

  return (
    <>
      <header className="encabezado py-3">
        <div className="container">
          <h1 className="h4 mb-0">Cafetería Origen</h1>
          <Encabezado mesa={mesa} />
        </div>
      </header>
      <main className="container py-3">
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
      </main>
    </>
  );
}
