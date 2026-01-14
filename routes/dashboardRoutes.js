import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { adminSummary, last7DaysSales, lowStockProduct, monthWiseOrders, openOrders, orderStatusCount, salesCustomerStats, salesProductSales } from '../controllers/dashboardControllers.js';

const router = express.Router();

router.get("/summary",protect,requireRole("admin"),adminSummary);
router.get("/sales",protect,requireRole("admin","manager"),salesCustomerStats);
router.get("/month-orders",protect,monthWiseOrders);
router.get("/sales-wise-sale",protect,salesProductSales);
router.get("/open-orders",protect,openOrders);
router.get("/low-stock",protect,lowStockProduct);
router.get("/last-7-days-sale",protect,last7DaysSales);
router.get("/order-status-count",protect,requireRole("admin","manager"),orderStatusCount);
export default router