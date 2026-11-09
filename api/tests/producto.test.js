const Producto = require('../src/models/Producto');
const Expreso = require('../src/models/Expreso');
const Filtrado = require('../src/models/Filtrado');
const Pasteleria = require('../src/models/Pasteleria');
const productoService = require('../src/services/productoService');

describe('calcularPrecio() - Expreso', () => {
  test.each([
    ['Pocillo', 'Brasil', 5020],
    ['Pocillo', 'Colombia', 5740],
    ['Pocillo', 'Etiopia', 6820],
    ['Mediano', 'Brasil', 6280],
    ['Mediano', 'Colombia', 7360],
    ['Mediano', 'Etiopia', 8980],
    ['Taza grande', 'Brasil', 7540],
    ['Taza grande', 'Colombia', 8980],
    ['Taza grande', 'Etiopia', 11140],
  ])('%s %s = $%i', (tamanio, variedad, esperado) => {
    expect(new Expreso({ id: 1, tamanio, variedad }).calcularPrecio()).toBe(esperado);
  });
});

describe('calcularPrecio() - Filtrado', () => {
  test.each([
    ['Pocillo', 'Brasil', 4040],
    ['Pocillo', 'Colombia', 4280],
    ['Pocillo', 'Etiopia', 4640],
    ['Mediano', 'Brasil', 5300],
    ['Mediano', 'Colombia', 5900],
    ['Mediano', 'Etiopia', 6800],
    ['Taza grande', 'Brasil', 6700],
    ['Taza grande', 'Colombia', 7700],
    ['Taza grande', 'Etiopia', 9200],
  ])('%s %s = $%i', (tamanio, variedad, esperado) => {
    expect(new Filtrado({ id: 1, tamanio, variedad }).calcularPrecio()).toBe(esperado);
  });
});

describe('calcularPrecio() - Pasteleria', () => {
  test('el muffin devuelve su precioBase', () => {
    expect(new Pasteleria({ id: 19, nombre: 'Muffin de chocolate', precioBase: 2500 }).calcularPrecio()).toBe(2500);
  });
  test('la torta devuelve su precioBase', () => {
    expect(new Pasteleria({ id: 20, nombre: 'Torta selva negra', precioBase: 4200 }).calcularPrecio()).toBe(4200);
  });
});

describe('Modelo', () => {
  test('Producto no se puede instanciar directamente', () => {
    expect(() => new Producto({ id: 1, nombre: 'x', precioBase: 1 })).toThrow();
  });
  test('rechaza variedad o tamaño inválidos', () => {
    expect(() => new Expreso({ id: 1, tamanio: 'Pocillo', variedad: 'Kenia' })).toThrow('Variedad inválida');
    expect(() => new Expreso({ id: 1, tamanio: 'Gigante', variedad: 'Brasil' })).toThrow('Tamaño inválido');
  });
  test('todos los productos tienen id, nombre y precioBase', () => {
    for (const producto of productoService.listar()) {
      expect(producto).toEqual(expect.objectContaining({ id: expect.any(Number), nombre: expect.any(String), precioBase: expect.any(Number) }));
    }
  });
});

describe('Catálogo', () => {
  test('tiene 20 productos con ids únicos', () => {
    const lista_id = productoService.listar().map((p) => p.id);
    expect(lista_id).toHaveLength(20);
    expect(new Set(lista_id).size).toBe(20);
  });
  test('obtenerPorId devuelve el producto correcto', () => {
    expect(productoService.obtenerPorId(5).calcularPrecio()).toBe(7360); // Expreso Mediano Colombia
  });
  test('obtenerPorId lanza 404 si no existe', () => {
    expect(() => productoService.obtenerPorId(999)).toThrow('no encontrado');
  });
});