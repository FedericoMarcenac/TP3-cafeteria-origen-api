import { z } from 'zod';

export const tamanioSchema = z.enum(['Pocillo', 'Mediano', 'Taza grande']);

export const variedadSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
});

export const cafeSchema = z.object({
  id: z.number().int(),
  tipo: z.enum(['expreso', 'filtrado']),
  nombre: z.string(),
  precio: z.number(),
  tamanio: tamanioSchema,
  variedad: variedadSchema,
});

export const pasteleriaSchema = z.object({
  id: z.number().int(),
  tipo: z.literal('pasteleria'),
  nombre: z.string(),
  precio: z.number(),
});

export const productoSchema = z.discriminatedUnion('tipo', [cafeSchema, pasteleriaSchema]);
export const productosSchema = z.array(productoSchema);

export const estadoPedidoSchema = z.enum(['pendiente', 'en_preparacion', 'entregado']);

export const itemPedidoSchema = z.object({
  productoId: z.number().int(),
  cantidad: z.number().int().positive(),
});

export const pedidoSchema = z.object({
  id: z.number().int(),
  mesaId: z.number().int().nullable(),
  items: z.array(itemPedidoSchema),
  estado: estadoPedidoSchema,
  total: z.number(),
});

export const errorSchema = z.object({
  error: z.string(),
});

export type Tamanio = z.infer<typeof tamanioSchema>;
export type ProductoCafe = z.infer<typeof cafeSchema>;
export type ProductoPasteleria = z.infer<typeof pasteleriaSchema>;
export type Producto = z.infer<typeof productoSchema>;
export type EstadoPedido = z.infer<typeof estadoPedidoSchema>;
export type ItemPedido = z.infer<typeof itemPedidoSchema>;
export type Pedido = z.infer<typeof pedidoSchema>;
