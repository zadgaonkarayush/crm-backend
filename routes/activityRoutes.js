import express from 'express';
import {protect} from '../middleware/authMiddleware.js'
import { getActivityLogs } from '../controllers/activityController.js';
const router = express.Router();

router.get("/",protect,getActivityLogs)

export default router;