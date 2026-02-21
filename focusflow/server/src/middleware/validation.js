import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    req.validatedBody = value;
    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const goalSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().optional(),
  dueDate: Joi.date().optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  category: Joi.string().optional(),
});

export const habitSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().optional(),
  frequency: Joi.string().valid('daily', 'weekly').optional(),
  category: Joi.string()
    .valid('health', 'productivity', 'learning', 'exercise', 'mindfulness', 'social', 'other')
    .optional(),
  goal: Joi.number().min(0).optional(),
  goalUnit: Joi.string().max(50).optional(),
});

export const updateHabitSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  frequency: Joi.string().valid('daily', 'weekly').optional(),
  category: Joi.string()
    .valid('health', 'productivity', 'learning', 'exercise', 'mindfulness', 'social', 'other')
    .optional(),
  goal: Joi.number().min(0).optional(),
  goalUnit: Joi.string().max(50).optional(),
  isActive: Joi.boolean().optional(),
});

export const markHabitCompleteSchema = Joi.object({
  notes: Joi.string().optional(),
  amount: Joi.number().min(0).optional(),
});

export const moodSchema = Joi.object({
  emoji: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().optional(),
});
