import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import { checkConnection } from './db/supabase.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import pomodoroRoutes from './routes/pomodoroRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase Connection
checkConnection()
  .then((isConnected) => {
    if (!isConnected) {
      console.log('⚠️  Warning: Supabase connection failed, but server continuing...');
    }
  })
  .catch((error) => {
    console.error('Connection error:', error);
  });

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/pomodoro', pomodoroRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'FocusFlow API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      goals: '/api/goals',
      habits: '/api/habits',
      mood: '/api/mood',
      pomodoro: '/api/pomodoro',
      dashboard: '/api/dashboard',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  FocusFlow Backend Server Running  ║
║  Port: ${PORT}                          ║
║  Environment: ${process.env.NODE_ENV}          ║
╚════════════════════════════════════╝
  `);
});

export default app;
