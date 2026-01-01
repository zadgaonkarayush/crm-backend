import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { bulkDeleteUser, deleteUser, getAllUsers } from '../controllers/userControllers.js';

const router = express.Router();

router.get(
    '/',
     protect,
  requireRole("admin", "manager"),
  getAllUsers
    
);
router.delete(
  '/:id',
  protect,
  requireRole("admin", "manager"),
  deleteUser
)
router.delete(
  '/',
  protect,
  requireRole("admin", "manager"),
  bulkDeleteUser
)
export default router;