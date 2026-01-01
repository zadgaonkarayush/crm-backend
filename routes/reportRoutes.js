import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { dailySalesReport, salesReport } from '../controllers/reportControllers.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get(
    '/sales',
    protect,
    requireRole("admin","manager"),
    salesReport
)
router.get(
    '/sales/daily',
    protect,
    requireRole("admin","manager"),
    dailySalesReport
)
export default router;