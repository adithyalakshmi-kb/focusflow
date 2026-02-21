import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getDashboard, getQuote } from '../controllers/dashboardController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getDashboard);
router.get('/quote', getQuote);

export default router;
