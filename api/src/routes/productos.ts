import { Router } from 'express';
import * as productoService from '../services/productoService';

const router = Router();

router.get('/', (req, res) => res.json(productoService.listar()));
router.get('/:id', (req, res) => res.json(productoService.obtenerPorId(req.params.id)));

export default router;
