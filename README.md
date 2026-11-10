# ☕ Cafetería Origen – TP3: menú de mesa

Programación IV · TUP · UTN FRBB

Menú web para pedir desde la mesa escaneando un QR, construido sobre la API del Parcial I.

| Carpeta | Contenido |
|---|---|
| [`api/`](api/) | API REST en Node.js + Express + TypeScript |
| [`frontend/`](frontend/) | Menú en Vite + React + TypeScript |

## Requisitos

Node.js 20.19 o superior (Vite 7 no arranca con versiones anteriores) y npm.

## Levantar la API

```bash
cd api
npm install
npm test
npm start    # http://localhost:3000
```

Con `npm run dev` se levanta con recarga automática. El detalle de endpoints, catálogo, arquitectura y tests está en [`api/README.md`](api/README.md).

## Levantar el front

Con la API corriendo en otra terminal:

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

- Para abrir el menú de una mesa, como lo haría el QR: http://localhost:5173/?mesa=4. Sin `?mesa`, o con una mesa inválida, el pedido es para retirar en la barra.
- El front llama a la API en `http://localhost:3000`. Para usar otra URL: `VITE_API_URL=http://localhost:4000 npm run dev`.

## Tests

Los comandos del front se corren dentro de `frontend/`.

| Nivel | Qué cubre | Dónde | Comando |
|---|---|---|---|
| Unitarios | Funciones puras: lectura de la mesa, búsqueda del café elegido, formato de precio, reducer del carrito y esquemas de Zod | `src/dominio/`, `src/carrito/`, `src/api/` | `npm test` |
| Componentes | Selector de café, pastelería, carrito, encabezado, confirmación y errores, con React Testing Library y user-event | `src/componentes/` | `npm test` |
| Integración | La app contra la API simulada con MSW 2: carga del menú, error 500 con reintento, API caída, respuesta fuera de contrato, pedido completo verificando el cuerpo enviado, error 4xx que conserva el carrito y seguimiento del estado | `src/integracion/`, `src/pedido/` | `npm test` |
| E2E | Recorrido feliz con el front y la API reales, y el ancho de 375 px | `e2e/` | `npm run test:e2e` |
| API | Endpoints, errores y endpoints de test, con Jest y Supertest | `api/tests/` | `npm test` dentro de `api/` |

`npm test` corre unitarios, componentes e integración sin la API levantada: MSW 2 la simula con las mismas rutas, códigos y formato de error.

### E2E

```bash
cd frontend
npx playwright install chromium   # solo la primera vez
npm run test:e2e
```

No hace falta levantar nada antes: Playwright arranca la API en el puerto 3001 con `NODE_ENV=test` y el front en el 5173 apuntando a esa API. Antes de cada test llama a `POST /__test__/reset` y `POST /__test__/seed`, que dejan cargado el pedido #1, así el pedido del test siempre es el #2.

Si tenés abierto `npm run dev` del front, cerralo antes: con el puerto 5173 ocupado, Playwright usa ese servidor, que apunta a la API de desarrollo y no a la de test.

### Otros chequeos

| Comando | Qué hace |
|---|---|
| `npm run typecheck` | TypeScript con `strict: true` |
| `npm run lint` | ESLint, con la regla que prohíbe `any` |
| `npm run build` | Arma la versión de producción en `dist/` |
| `npm run test:watch` | Los tests de Vitest en modo observador |

## Qué hace el menú

Las rutas son dentro de `frontend/src/`.

| # | Funcionalidad | Dónde está |
|---|---|---|
| 1 | Mesa desde el QR (`?mesa=N`, o retiro en la barra) | `dominio/mesa.ts`, `componentes/Encabezado.tsx` |
| 2 | Menú cargado de la API, con indicador, error y botón Reintentar | `menu/useMenu.ts`, `componentes/CargaDelMenu.tsx` |
| 3 | Café en tres pasos: bebida, tamaño y origen, con la descripción y el precio de cada origen | `dominio/cafe.ts`, `componentes/SelectorCafe.tsx` |
| 4 | Pastelería con su precio y un botón para agregar | `componentes/Pasteleria.tsx` |
| 5 | Carrito: sumar, restar, quitar y subtotal orientativo | `carrito/`, `componentes/Carrito.tsx` |
| 6 | Confirmar el pedido con la mesa y los ítems | `pedido/usePedido.ts`, `componentes/Confirmacion.tsx` |
| 7 | Seguir el pedido con "Actualizar estado", sin recargar la página | `obtenerPedido` en `api/cliente.ts`, `componentes/Confirmacion.tsx` |
| 8 | Errores: el mensaje que devolvió la API, sin perder el carrito | `componentes/ErrorDelPedido.tsx` |
| 9 | Pensado para el celular: 375 px sin scroll horizontal | Bootstrap, y el chequeo del E2E |

## Cómo está armado el front

- **Contrato con Zod.** `api/esquemas.ts` tiene un esquema por respuesta y los tipos salen de ahí con `z.infer`. `api/cliente.ts` es el único módulo que hace `fetch`: valida cada respuesta y, si no cumple el contrato, la app muestra un error en lugar de datos rotos.
- **Uniones discriminadas** para la carga del menú (`cargando`, `error`, `listo`) y para el envío del pedido (`editando`, `enviando`, `confirmado`, `error`), así nunca hay dos estados a la vez.
- **Carrito en un Context**, con `useReducer` y un reducer puro que se testea sin React.
- **Precios de la API.** El front muestra el `precio` de cada producto y el `total` del pedido tal como vienen, y solo les da formato con `formatearPrecio`. El subtotal del carrito es orientativo.
- **Bootstrap personalizado con SASS.** Los colores de la cafetería son variables en `estilos/main.scss`, definidas antes de importar Bootstrap.
- **Accesibilidad.** Cada control tiene su etiqueta, y los tests lo buscan por rol y nombre.

Stack: Vite 7, React 19, TypeScript, Vitest 3, React Testing Library, MSW 2, Zod 4, Playwright y Bootstrap 5.

## Contrato de la API que usa el front

Todos los errores responden `{ "error": "mensaje" }`. Los datos inválidos dan 400, lo inexistente da 404 y nunca un 500. CORS está habilitado.

### `GET /productos` y `GET /productos/:id`

```json
{
  "id": 5,
  "tipo": "expreso",
  "nombre": "Expreso Mediano Colombia",
  "precioBase": 2500,
  "precio": 7360,
  "tamanio": "Mediano",
  "variedad": {
    "nombre": "Colombia",
    "descripcion": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
  },
  "gramos": 27,
  "costoCafe": 4860
}
```

| Campo | Valores |
|---|---|
| `tipo` | `expreso`, `filtrado` o `pasteleria` |
| `tamanio` | `Pocillo`, `Mediano` o `Taza grande` |
| `variedad.nombre` | `Brasil`, `Colombia` o `Etiopía` |
| `precio` | El de `calcularPrecio()`: el front lo muestra tal cual |

La pastelería trae solo `id`, `tipo`, `nombre`, `precioBase` y `precio`. Ids: 1 a 9 expresos, 10 a 18 filtrados, 19 muffin de chocolate y 20 torta selva negra.

### `POST /pedidos`

```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```

`mesaId` es opcional (mesas de 1 a 12); sin mesa, el pedido es para retirar en la barra. Responde **201**:

```json
{
  "id": 2,
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ],
  "estado": "pendiente",
  "total": 17220
}
```

| Código | Cuándo | Ejemplo de `error` |
|---|---|---|
| 400 | Sin items, cantidad no entera o menor a 1, `productoId` o `mesaId` no entero, JSON mal formado | `La cantidad debe ser un entero mayor a 0` |
| 404 | Producto o mesa inexistente | `Mesa 99 no encontrada` |

### `GET /pedidos/:id`

Devuelve el mismo formato que `POST /pedidos`, con el `estado` actual (`pendiente`, `en_preparacion` o `entregado`). Si no existe: 404 `{ "error": "Pedido 42 no encontrado" }`.

La API no tiene un endpoint para cambiar el estado de un pedido, así que el paso de `pendiente` a `en_preparacion` se prueba en integración, con MSW.

### Endpoints de test

Solo existen si la API arranca con `NODE_ENV=test`, como lo hace Playwright:

| Endpoint | Qué hace |
|---|---|
| `POST /__test__/reset` | Borra los pedidos y vuelve a numerar desde 1. Responde 204 |
| `POST /__test__/seed` | Reinicia y carga el pedido #1 (mesa 1, una torta selva negra, entregado). Responde 201 |

## Equipo

| Integrante | Legajo |
|---|---|
| Federico Marcenac | 23371 |
| Ulises Fossati | 22357 |
| Ignacio Alvarado | 22356 |
| Ramiro Cutropia | 22105 |
