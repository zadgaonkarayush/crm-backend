import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, generateInvoice, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/orderControllers.js";

const router = express.Router();

router.post("/",protect,createOrder);
router.get("/",protect,getAllOrders);
router.get("/:id",protect,getOrderById);
router.put("/:id",protect,updateOrderStatus);
router.post("/:id/invoice",protect,generateInvoice);

export default router;