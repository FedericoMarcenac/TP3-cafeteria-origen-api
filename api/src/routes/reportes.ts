import { Router } from 'express';
import * as reporteService from '../services/reporteService';

const router = Router();

router.get('/facturacion', (req, res) =>
  res.json({ facturacionTotal: reporteService.facturacionTotal() })
);
router.get('/mas-vendido', (req, res) => res.json(reporteService.masVendido()));

export default router;
