import { Router } from 'express';
import authRoutes from './auth-routes.js';
import userReports from '../models/user.js'
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use('/auth', authRoutes);
router.use("/users", authenticateToken, userRoutes);
router.use('/api', authenticateToken, apiRoutes);

export default router;
