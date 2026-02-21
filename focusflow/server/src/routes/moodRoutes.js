import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateRequest, moodSchema } from '../middleware/validation.js';
import { logMood, getMoodHistory, getTodayMood } from '../controllers/moodController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateRequest(moodSchema), logMood);
router.get('/', getMoodHistory);
router.get('/today', getTodayMood);

export default router;
