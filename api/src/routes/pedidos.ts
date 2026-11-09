import { Router } from 'express';
import * as pedidoService from '../services/pedidoService';

const router = Router();

router.post('/', (req, res) => res.status(201).json(pedidoService.crear(req.body)));
router.get('/', (req, res) => res.json(pedidoService.listar()));
router.get('/:id', (req, res) => res.json(pedidoService.obtenerPorId(req.params.id)));

export default router;
