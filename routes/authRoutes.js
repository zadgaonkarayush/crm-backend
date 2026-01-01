import express from 'express';

import {signup,login} from '../controllers/authControllers.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router =express.Router();

router.post("/signup",protect,
    requireRole("admin","manager"),signup);
router.post("/login",login);

export default router;