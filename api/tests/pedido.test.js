const pedidoService = require('../src/services/pedidoService');
const reporteService = require('../src/services/reporteService');

// ids: 5 = Expreso Mediano Colombia ($7.360), 10 = Filtrado Pocillo Brasil ($4.040),
//      19 = Muffin ($2.500), 20 = Torta ($4.200)

beforeEach(() => pedidoService.reiniciar());

describe('Total de un pedido', () => {
  test('suma calcularPrecio() x cantidad', () => {
    const pedido = pedidoService.crear({
      items: [{ productoId: 5, cantidad: 2 }, { productoId: 19, cantidad: 1 }],
    });
    expect(pedido.total).toBe(7360 * 2 + 2500);
  });
  test('estado por defecto: pendiente', () => {
    expect(pedidoService.crear({ items: [{ productoId: 19, cantidad: 1 }] }).estado).toBe('pendiente');
  });
  test('id autoincrementales', () => {
    const pedido_a = pedidoService.crear({ items: [{ productoId: 19, cantidad: 1 }] });
    const pedido_b = pedidoService.crear({ items: [{ productoId: 19, cantidad: 1 }] });
    expect(pedido_b.id).toBe(pedido_a.id + 1);
  });
});

describe('Validaciones', () => {
  test('rechaza pedido sin items', () => {
    expect(() => pedidoService.crear({ items: [] })).toThrow('al menos un item');
    expect(() => pedidoService.crear({})).toThrow('al menos un item');
  });
  test('rechaza cantidad inválida', () => {
    expect(() => pedidoService.crear({ items: [{ productoId: 5, cantidad: 0 }] })).toThrow('cantidad');
    expect(() => pedidoService.crear({ items: [{ productoId: 5, cantidad: -1 }] })).toThrow('cantidad');
    expect(() => pedidoService.crear({ items: [{ productoId: 5, cantidad: 1.5 }] })).toThrow('cantidad');
  });
  test('rechaza producto inexistente', () => {
    expect(() => pedidoService.crear({ items: [{ productoId: 999, cantidad: 1 }] })).toThrow('no encontrado');
  });
  test('rechaza estado inválido', () => {
    expect(() => pedidoService.crear({ items: [{ productoId: 5, cantidad: 1 }], estado: 'volando' })).toThrow('Estado inválido');
  });
  test('obtenerPorId lanza error si no existe', () => {
    expect(() => pedidoService.obtenerPorId(42)).toThrow('no encontrado');
  });
});

describe('Reportes', () => {
  test('sin pedidos: facturación 0, nada vendido, sin más vendido', () => {
    expect(reporteService.facturacionTotal()).toBe(0);
    expect(reporteService.cantidadPorProducto()).toEqual({});
    expect(reporteService.masVendido()).toEqual({ producto: null, cantidad: 0 });
  });

  test('facturación total = suma de los totales de todos los pedidos', () => {
    pedidoService.crear({ items: [{ productoId: 5, cantidad: 2 }] }); // 14720
    pedidoService.crear({ items: [{ productoId: 20, cantidad: 1 }] }); // 4200
    expect(reporteService.facturacionTotal()).toBe(18920);
  });

  test('cantidad vendida por producto acumula entre pedidos', () => {
    pedidoService.crear({ items: [{ productoId: 5, cantidad: 2 }, { productoId: 10, cantidad: 1 }] });
    pedidoService.crear({ items: [{ productoId: 5, cantidad: 3 }] });
    expect(reporteService.cantidadPorProducto()).toEqual({
      'Expreso Mediano Colombia': 5,
      'Filtrado Pocillo Brasil': 1,
    });
  });

  test('producto más vendido sale de las cantidades', () => {
    pedidoService.crear({ items: [{ productoId: 19, cantidad: 1 }, { productoId: 10, cantidad: 4 }] });
    pedidoService.crear({ items: [{ productoId: 19, cantidad: 2 }] });
    expect(reporteService.masVendido()).toEqual({ producto: 'Filtrado Pocillo Brasil', cantidad: 4 });
  });
});
