const { Router } = require('express');
const reporteService = require('../services/reporteService');

const router = Router();

router.get('/facturacion', (req, res) =>
  res.json({ facturacionTotal: reporteService.facturacionTotal() })
);
router.get('/mas-vendido', (req, res) => res.json(reporteService.masVendido()));

module.exports = router;
