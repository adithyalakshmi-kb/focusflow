import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateRequest, goalSchema } from '../middleware/validation.js';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../controllers/goalController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getGoals);
router.post('/', validateRequest(goalSchema), createGoal);
router.patch('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
