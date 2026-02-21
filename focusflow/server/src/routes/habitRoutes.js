import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
  validateRequest, 
  habitSchema,
  updateHabitSchema,
  markHabitCompleteSchema,
} from '../middleware/validation.js';
import {
  getHabits,
  createHabit,
  markHabitComplete,
  undoHabitComplete,
  deleteHabit,
  getHabitStreak,
  getHabitAnalytics,
  getHabitTemplates,
  createHabitFromTemplate,
  updateHabit,
} from '../controllers/habitController.js';

const router = express.Router();

router.use(authMiddleware);

// Templates endpoints (must come before /:id routes)
router.get('/templates/list', getHabitTemplates);
router.post('/templates/create', createHabitFromTemplate);

// Main habit endpoints
router.get('/', getHabits);
router.post('/', validateRequest(habitSchema), createHabit);

// Individual habit endpoints (with :id parameter)
router.patch('/:id', validateRequest(updateHabitSchema), updateHabit);
router.delete('/:id', deleteHabit);
router.patch('/:id/complete', validateRequest(markHabitCompleteSchema), markHabitComplete);
router.patch('/:id/undo', undoHabitComplete);
router.get('/:id/analytics', getHabitAnalytics);
router.get('/:id/streak', getHabitStreak);

export default router;
