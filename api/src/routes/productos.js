const { Router } = require('express');
const productoService = require('../services/productoService');

const router = Router();

router.get('/', (req, res) => res.json(productoService.listar()));
router.get('/:id', (req, res) => res.json(productoService.obtenerPorId(req.params.id)));

module.exports = router;
