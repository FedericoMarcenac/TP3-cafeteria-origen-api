import { Router } from 'express';
import { PEDIDOS_SEMILLA } from '../data/semilla';
import * as pedidoService from '../services/pedidoService';

const router = Router();

router.post('/reset', (req, res) => {
  pedidoService.reiniciar();
  res.status(204).end();
});

router.post('/seed', (req, res) => {
  pedidoService.reiniciar();
  res.status(201).json(PEDIDOS_SEMILLA.map((pedido) => pedidoService.crear(pedido)));
});

export default router;
