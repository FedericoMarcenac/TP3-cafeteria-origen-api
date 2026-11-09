# ☕ Cafetería Origen – API de pedidos

API REST desarrollada con **Node.js y Express** para organizar los pedidos de *Origen*, una cafetería de especialidad que vende café de Colombia, Etiopía y Brasil, preparado como expreso o filtrado, además de pastelería. Hoy los pedidos se anotan en un cuaderno: esta API los centraliza, calcula los totales y genera reportes de ventas.

> Trabajo grupal – Parcial I

## Contenido

- [Tecnologías](#tecnologías)
- [Cómo correrlo](#cómo-correrlo)
- [Endpoints](#endpoints)
- [Ejemplos de uso](#ejemplos-de-uso)
- [Catálogo y precios](#catálogo-y-precios)
- [Arquitectura](#arquitectura)
- [Decisiones de diseño](#decisiones-de-diseño)
- [Manejo de errores](#manejo-de-errores)
- [Tests](#tests)
- [Equipo](#equipo)
- [Video](#video)

## Tecnologías

| Herramienta | Uso |
|---|---|
| Node.js | Entorno de ejecución |
| Express | Servidor y rutas |
| Jest | Framework de tests |
| Supertest | Tests de los endpoints |

## Cómo correrlo

Requiere [Node.js](https://nodejs.org) (versión LTS).

```bash
git clone https://github.com/FedericoMarcenac/cafeteria-origen-api.git
cd cafeteria-origen-api
npm install
npm test     # corre los tests
npm start    # levanta el servidor en http://localhost:3000
```

Para usar otro puerto:

```bash
PORT=4000 npm start            # macOS / Linux
$env:PORT=4000; npm start      # Windows PowerShell
```

> Los datos se guardan **en memoria**: al reiniciar el servidor, los pedidos se borran.

## Endpoints

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| GET | `/productos` | Lista de todos los productos | 200 |
| GET | `/productos/:id` | Producto según su id | 200 / 404 |
| POST | `/pedidos` | Crea un pedido y lo devuelve con su total calculado | 201 / 400 / 404 |
| GET | `/pedidos` | Lista de todos los pedidos | 200 |
| GET | `/pedidos/:id` | Pedido según su id | 200 / 404 |
| GET | `/reportes/facturacion` | Facturación total | 200 |
| GET | `/reportes/mas-vendido` | Producto más vendido | 200 |

### Formato del pedido

```json
{
  "items": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ],
  "estado": "pendiente"
}
```

- `items` es obligatorio y debe tener al menos un elemento.
- `cantidad` debe ser un entero mayor a 0.
- `estado` es opcional (por defecto `pendiente`). Valores válidos: `pendiente`, `en_preparacion`, `entregado`.

## Ejemplos de uso

Con el servidor corriendo (`npm start`).

**Ver un producto**

```bash
curl http://localhost:3000/productos/5
```

```json
{
  "id": 5,
  "nombre": "Expreso Mediano Colombia",
  "tipo": "Expreso",
  "precioBase": 2500,
  "precio": 7360,
  "tamanio": "Mediano",
  "variedad": "Colombia",
  "gramos": 27,
  "costoCafe": 4860
}
```

**Crear un pedido** (2 expresos pocillo Brasil + 1 muffin)

```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productoId":1,"cantidad":2},{"productoId":19,"cantidad":1}]}'
```

```json
{
  "id": 1,
  "items": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ],
  "estado": "pendiente",
  "total": 12540
}
```

**Facturación total**

```bash
curl http://localhost:3000/reportes/facturacion
```

```json
{ "facturacionTotal": 12540 }
```

**Producto más vendido**

```bash
curl http://localhost:3000/reportes/mas-vendido
```

```json
{ "producto": "Expreso Pocillo Brasil", "cantidad": 2 }
```

Si todavía no hay ventas, devuelve `{ "producto": null, "cantidad": 0 }`.

### En Windows PowerShell

En PowerShell, `curl` es un alias de otro comando. Usá `Invoke-RestMethod`:

```powershell
Invoke-RestMethod http://localhost:3000/productos/5 | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:3000/pedidos `
  -ContentType "application/json" `
  -Body '{"items":[{"productoId":1,"cantidad":2},{"productoId":19,"cantidad":1}]}' |
  ConvertTo-Json -Depth 5
```

## Catálogo y precios

Hay **20 productos**: 9 expresos, 9 filtrados y 2 de pastelería.

### Cálculo del precio

Para los cafés:

```
precio = precioBase + (gramos × precio por gramo de la variedad)
```

| Variedad | Precio por gramo |
|---|---|
| Brasil | $140 |
| Colombia | $180 |
| Etiopía | $240 |

| Tipo | precioBase | Pocillo | Mediano | Taza grande |
|---|---|---|---|---|
| Expreso | $2.500 | 18 g | 27 g | 36 g |
| Filtrado | $3.200 | 6 g | 15 g | 25 g |

Para la pastelería, el precio es directamente el `precioBase`.

### Lista completa

| Id | Producto | Precio |
|---|---|---|
| 1 | Expreso Pocillo Brasil | $5.020 |
| 2 | Expreso Pocillo Colombia | $5.740 |
| 3 | Expreso Pocillo Etiopía | $6.820 |
| 4 | Expreso Mediano Brasil | $6.280 |
| 5 | Expreso Mediano Colombia | $7.360 |
| 6 | Expreso Mediano Etiopía | $8.980 |
| 7 | Expreso Taza grande Brasil | $7.540 |
| 8 | Expreso Taza grande Colombia | $8.980 |
| 9 | Expreso Taza grande Etiopía | $11.140 |
| 10 | Filtrado Pocillo Brasil | $4.040 |
| 11 | Filtrado Pocillo Colombia | $4.280 |
| 12 | Filtrado Pocillo Etiopía | $4.640 |
| 13 | Filtrado Mediano Brasil | $5.300 |
| 14 | Filtrado Mediano Colombia | $5.900 |
| 15 | Filtrado Mediano Etiopía | $6.800 |
| 16 | Filtrado Taza grande Brasil | $6.700 |
| 17 | Filtrado Taza grande Colombia | $7.700 |
| 18 | Filtrado Taza grande Etiopía | $9.200 |
| 19 | Muffin de chocolate | $2.500 |
| 20 | Torta selva negra | $4.200 |

## Arquitectura

El proyecto separa responsabilidades en capas: **rutas → servicios → modelos**.

```
cafeteria-origen-api/
├── package.json
├── README.md
├── src/
│   ├── app.js                    # App Express, rutas y manejo de errores
│   ├── server.js                 # Arranque del servidor (listen)
│   ├── errors.js                 # ErrorApi: error con código HTTP
│   ├── models/
│   │   ├── Producto.js           # Clase base abstracta
│   │   ├── Cafe.js               # Lógica común de expreso y filtrado
│   │   ├── Expreso.js
│   │   ├── Filtrado.js
│   │   └── Pasteleria.js
│   ├── data/
│   │   └── catalogo.js           # Genera los 20 productos
│   ├── services/
│   │   ├── productoService.js    # Consulta del catálogo
│   │   ├── pedidoService.js      # Pedidos, validaciones y total
│   │   └── reporteService.js     # Facturación y más vendido
│   └── routes/
│       ├── productos.js
│       ├── pedidos.js
│       └── reportes.js
└── tests/
    ├── producto.test.js
    ├── pedido.test.js
    └── api.test.js
```

### Jerarquía de productos

```
Producto (abstracta)
├── Cafe
│   ├── Expreso
│   └── Filtrado
└── Pasteleria
```

Todos los productos tienen `id`, `nombre`, `precioBase` y el método `calcularPrecio()`, que cada clase implementa a su manera.

## Decisiones de diseño

- **Herencia y polimorfismo.** `Producto` es abstracta y define `calcularPrecio()`; cada subclase lo resuelve distinto. El resto del código solo llama al método, sin importar el tipo de producto.
- **Clase intermedia `Cafe`.** Expreso y filtrado calculan igual (base + gramos × precio por gramo) y solo cambian los gramos y el precioBase. La fórmula está escrita una sola vez.
- **El total no se guarda.** Se calcula siempre desde `calcularPrecio()` × cantidad, así nunca queda desactualizado.
- **Reportes sin lógica duplicada.** `masVendido()` se calcula a partir de `cantidadPorProducto()`.
- **Rutas sin lógica de negocio.** Reciben el request y delegan en los servicios.
- **`app` separada de `listen`.** `app.js` exporta la aplicación y `server.js` la levanta, lo que permite testearla con Supertest sin abrir un puerto.
- **Datos en memoria.** El enunciado no pide base de datos; `pedidoService.reiniciar()` limpia el estado entre tests.

## Manejo de errores

Todos los errores responden con JSON: `{ "error": "mensaje" }`.

| Código | Cuándo |
|---|---|
| 201 | Pedido creado |
| 400 | Pedido sin items, cantidad inválida, `productoId` no numérico, estado inválido o JSON mal formado |
| 404 | Producto o pedido inexistente, o ruta inexistente |

Ejemplo:

```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productoId":1,"cantidad":0}]}'
```

```json
{ "error": "La cantidad debe ser un entero mayor a 0" }
```

## Tests

```bash
npm test
```

Se usan **Jest** y **Supertest**. Hay 54 tests en 3 suites:

| Suite | Qué prueba | Tests |
|---|---|---|
| `tests/producto.test.js` | `calcularPrecio()` de las 18 combinaciones de café y de la pastelería (contra la tabla del enunciado), clase abstracta, validaciones del modelo y catálogo de 20 productos | 26 |
| `tests/pedido.test.js` | Total del pedido, ids, validaciones, facturación, cantidad por producto y más vendido | 12 |
| `tests/api.test.js` | Los 7 endpoints con casos de éxito y de error (400 y 404) | 16 |

## Equipo

| Integrante | Legajo | Parte del trabajo |
|---|---|---|
| Federico Marcenac | 23371 | Modelos de productos y catálogo |
| Ulises Fossati | 22357 | Pedidos y reportes |
| Ignacio Alvarado | 22356 | Rutas y manejo de errores |
| Ramiro Cutropia | 22105 | Tests |

## Video

🎥 [Ver video del proyecto](COMPLETAR_LINK_DEL_VIDEO)
