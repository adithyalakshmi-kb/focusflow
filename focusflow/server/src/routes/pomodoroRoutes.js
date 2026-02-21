import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  startSession,
  endSession,
  getSessionStats,
  getCurrentSession,
} from '../controllers/pomodoroController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/start', startSession);
router.patch('/:id/end', endSession);
router.get('/stats', getSessionStats);
router.get('/current', getCurrentSession);

export default router;
