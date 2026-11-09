const { Router } = require('express');
const pedidoService = require('../services/pedidoService');

const router = Router();

router.post('/', (req, res) => res.status(201).json(pedidoService.crear(req.body)));
router.get('/', (req, res) => res.json(pedidoService.listar()));
router.get('/:id', (req, res) => res.json(pedidoService.obtenerPorId(req.params.id)));

module.exports = router;
