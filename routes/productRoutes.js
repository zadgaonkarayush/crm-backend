import express from 'express';
import { bulkProductDelete, createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productControllers.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/',protect,getAllProducts);

router.post(
    '/',
    protect,
    requireRole("admin","manager"),
    createProduct
);

router.put(
    '/:id',
    protect,
    requireRole("admin","manager"),
    updateProduct
);
router.delete(
    '/:id',
    protect,
    requireRole("admin","manager"),
    deleteProduct
)
router.delete(
  '/',
  protect,
  requireRole("admin"),
  bulkProductDelete
)
router.get('/:id',protect,getProductById)
export default router;