import type { Tamanio, Variedad } from '../models/Cafe';
import { Expreso } from '../models/Expreso';
import { Filtrado } from '../models/Filtrado';
import { Pasteleria } from '../models/Pasteleria';
import type { Producto } from '../models/Producto';

const TAMANIOS: Tamanio[] = ['Pocillo', 'Mediano', 'Taza grande'];
const VARIEDADES: Variedad[] = ['Brasil', 'Colombia', 'Etiopia'];

// Ids: 1-9 expresos, 10-18 filtrados, 19 muffin, 20 torta.
export function construirCatalogo(): Producto[] {
  const productos: Producto[] = [];
  let id = 1;
  for (const Clase of [Expreso, Filtrado]) {
    for (const tamanio of TAMANIOS) {
      for (const variedad of VARIEDADES) {
        productos.push(new Clase({ id: id++, tamanio, variedad }));
      }
    }
  }
  productos.push(new Pasteleria({ id: id++, nombre: 'Muffin de chocolate', precioBase: 2500 }));
  productos.push(new Pasteleria({ id: id++, nombre: 'Torta selva negra', precioBase: 4200 }));
  return productos;
}
