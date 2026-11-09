# ☕ Cafetería Origen – TP3: menú de mesa

Programación IV · TUP · UTN FRBB

Menú web para pedir desde la mesa escaneando un QR, construido sobre la API del Parcial I.

| Carpeta | Contenido |
|---|---|
| [`api/`](api/) | API REST en Node.js + Express + TypeScript |
| [`frontend/`](frontend/) | Menú en Vite + React + TypeScript |

## Levantar la API

```bash
cd api
npm install
npm test
npm start    # http://localhost:3000
```

El detalle de endpoints, catálogo, arquitectura y tests está en [`api/README.md`](api/README.md).

Para los E2E, la API se levanta con `NODE_ENV=test`, que habilita `POST /__test__/reset` y `POST /__test__/seed`.

## Levantar el front

Con la API corriendo en otra terminal:

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

El front llama a la API en `http://localhost:3000`. Para usar otra URL: `VITE_API_URL=http://localhost:4000 npm run dev`.

## Tests del front

```bash
cd frontend
npm test
```

| Comando | Qué corre |
|---|---|
| `npm test` | Tests unitarios, de componentes y de integración con Vitest. No necesita la API: MSW 2 la simula con las mismas rutas, códigos y formato de error |
| `npm run test:watch` | Lo mismo, en modo observador |
| `npm run typecheck` | TypeScript con `strict: true` |
| `npm run lint` | ESLint, con la regla que prohíbe `any` |

Stack: Vite 7, React 19, TypeScript, Vitest 3, React Testing Library, MSW 2, Zod 4 y Bootstrap 5 personalizado con SASS.

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

## Equipo

| Integrante | Legajo |
|---|---|
| Federico Marcenac | 23371 |
| Ulises Fossati | 22357 |
| Ignacio Alvarado | 22356 |
| Ramiro Cutropia | 22105 |
