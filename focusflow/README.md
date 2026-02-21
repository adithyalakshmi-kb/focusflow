# FocusFlow - A Self-Development Productivity Tracker

FocusFlow is a modern web application designed to help students and professionals track their productivity, manage goals, build habits, and maintain work-life balance through Pomodoro sessions and mood tracking.

## Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based auth with email verification & password reset
- 📋 **Goal Management** - Create, edit, delete, and track daily goals with priorities
- 🔄 **Habit Tracking** - Build habits with streak counters and daily check-offs
- ⏱️ **Pomodoro Timer** - 25/5 minute work/break cycles with session tracking
- 😊 **Mood Tracking** - Emoji-based mood logging with 7-day history
- 📊 **Dashboard** - Real-time stats, weekly progress graphs, productivity score
- 💡 **Smart Features** - Daily motivational quotes, break suggestions after 2+ hours of focus
- 🌙 **Dark Mode** - Easy on the eyes with persistent dark mode toggle
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Node.js + Express** - API server
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Token-based authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Joi** - Input validation
- **CORS** - Cross-origin support

## Project Structure

```
focusflow/
├── client/                           # React frontend (Vite)
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Layout.jsx           # Main layout wrapper
│   │   │   ├── Navbar.jsx           # Top navigation
│   │   │   └── Sidebar.jsx          # Side navigation
│   │   ├── pages/                    # Page components
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Goals.jsx            # Goals management
│   │   │   ├── Habits.jsx           # Habit tracking
│   │   │   ├── Timer.jsx            # Pomodoro timer
│   │   │   ├── Mood.jsx             # Mood tracking
│   │   │   ├── Profile.jsx          # User settings
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration
│   │   │   ├── ForgotPassword.jsx   # Password reset request
│   │   │   └── ResetPassword.jsx    # Password reset form
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.js           # Auth context hook
│   │   │   ├── useTheme.js          # Theme context hook
│   │   │   ├── useFetch.js          # Data fetching hook
│   │   │   └── usePomodoro.js       # Timer logic hook
│   │   ├── context/                  # Context providers
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   ├── ThemeContext.jsx     # Dark mode state
│   │   │   └── AppStateContext.jsx  # App state
│   │   ├── api/                      # API client
│   │   │   ├── client.js            # Axios instance
│   │   │   └── index.js             # API endpoints
│   │   ├── styles/                   # CSS files
│   │   │   └── index.css            # Global styles
│   │   ├── utils/                    # Utility functions
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── index.html                    # HTML template
│   ├── vite.config.js               # Vite config
│   ├── tailwind.config.js           # Tailwind config
│   ├── postcss.config.js            # PostCSS config
│   └── package.json                 # Dependencies
├── server/                           # Node.js backend (Express)
│   ├── src/
│   │   ├── models/                   # MongoDB schemas
│   │   │   ├── User.js              # User schema
│   │   │   ├── Goal.js              # Goal schema
│   │   │   ├── Habit.js             # Habit schema
│   │   │   ├── Mood.js              # Mood schema
│   │   │   └── Session.js           # Pomodoro session schema
│   │   ├── routes/                   # API routes
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   ├── goalRoutes.js        # Goal endpoints
│   │   │   ├── habitRoutes.js       # Habit endpoints
│   │   │   ├── moodRoutes.js        # Mood endpoints
│   │   │   ├── pomodoroRoutes.js    # Pomodoro endpoints
│   │   │   └── dashboardRoutes.js   # Dashboard endpoints
│   │   ├── controllers/              # Business logic
│   │   │   ├── authController.js    # Auth logic
│   │   │   ├── goalController.js    # Goal logic
│   │   │   ├── habitController.js   # Habit logic
│   │   │   ├── moodController.js    # Mood logic
│   │   │   ├── pomodoroController.js # Pomodoro logic
│   │   │   └── dashboardController.js # Dashboard logic
│   │   ├── middleware/               # Express middleware
│   │   │   ├── authMiddleware.js    # JWT verification
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   └── validation.js        # Input validation
│   │   ├── utils/                    # Utility functions
│   │   │   ├── tokenUtils.js        # JWT utilities
│   │   │   ├── emailUtils.js        # Email sending
│   │   │   └── helpers.js           # Helper functions
│   │   └── server.js                # Express server setup
│   ├── .env.example                  # Environment template
│   └── package.json                 # Dependencies
├── docker-compose.yml               # MongoDB setup
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

#### 1. Clone or Create Project

```bash
cd focusflow
```

#### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env
```

Edit `.env` with your settings:
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/focusflow?authSource=admin
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_change_this
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
FRONTEND_URL=http://localhost:5173
```

#### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### 4. MongoDB Setup (Choose One)

**Option A: Docker (Recommended for local development)**

```bash
# In root directory, start MongoDB
docker-compose up -d

# Access MongoDB Express UI at http://localhost:8081 (admin/admin)
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Copy connection string to `MONGODB_URI` in `.env`:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/focusflow?retryWrites=true&w=majority
   ```

## Running the Application

### Development Mode

**Terminal 1 - Backend**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Production Build

**Backend:** Already configured for production
```bash
cd server
npm start
```

**Frontend:** Build for production
```bash
cd client
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Complete password reset
- `POST /api/auth/refresh-token` - Get new access token
- `POST /api/auth/logout` - Logout

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PATCH /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create habit
- `PATCH /api/habits/:id/complete` - Mark habit complete today
- `GET /api/habits/:id/streak` - Get habit streak info
- `DELETE /api/habits/:id` - Delete habit

### Mood
- `POST /api/mood` - Log mood
- `GET /api/mood` - Get mood history (7 days)
- `GET /api/mood/today` - Get today's mood

### Pomodoro
- `POST /api/pomodoro/start` - Start session
- `PATCH /api/pomodoro/:id/end` - End session
- `GET /api/pomodoro/stats` - Get focus statistics
- `GET /api/pomodoro/current` - Get current session

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/quote` - Get motivational quote

## Key Features Explained

### Streak Calculation
Habits show current streak and longest streak. A streak is calculated by checking consecutive days with completed entries.

### Productivity Score
Calculated from:
- **Goals (30%)**: Percentage of goals completed
- **Habits (40%)**: Average habit streak divided by 30
- **Focus Time (30%)**: Hours focused divided by 10

### Smart Break Suggestion
When user works for 2+ consecutive hours (multiple Pomodoro sessions), a notification suggests taking a break.

### Email Verification Flow
1. User registers
2. Email sent with verification link
3. User clicks link to verify
4. Can reset password or resend verification email

## Dark Mode
- Toggle via navbar button
- Preference saved in localStorage
- Uses Tailwind's dark mode class (`.dark`)

## Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Sidebar hidden on mobile
- Mobile menu available via hamburger icon

## Best Practices Implemented

✅ **Security**
- JWT token-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Input validation with Joi
- HTTP-only cookie consideration (can be added)

✅ **Performance**
- Lazy loading of routes
- Optimized re-renders with hooks
- API response caching in context
- Efficient database queries with indexes

✅ **Code Quality**
- Modular component structure
- Separation of concerns
- Reusable custom hooks
- Error handling throughout
- Environment variables for configuration

✅ **User Experience**
- Smooth transitions and animations
- Loading states
- Error messages
- Responsive design
- Dark mode support

## Environment Variables

### Server (.env.example in server folder)
```
MONGODB_URI=mongodb://admin:password123@localhost:27017/focusflow?authSource=admin
PORT=5000
NODE_ENV=development
JWT_SECRET=change_me_in_production
REFRESH_TOKEN_SECRET=change_me_in_production
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
QUOTE_API_URL=https://api.quotable.io/quotes
```

### Client (.env.example in client folder)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (Docker or Atlas)
- Check connection string in `.env`
- Verify firewall settings

### CORS Errors
- Ensure backend CORS is configured with correct `FRONTEND_URL`
- Clear browser cookies and cache
- Check API base URL in frontend `.env`

### Email Not Sending
- Enable "Less secure apps" in Gmail settings OR use app password
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in backend `.env`
- Check email service configuration

### Port Already in Use
- Backend: Change `PORT` in `.env` (and update frontend API URL)
- Frontend: Vite will automatically try next available port
- Or kill process: `lsof -ti:5000 | xargs kill -9`

## Deployment

### Deploy Frontend (Vercel)
```bash
cd client
npm install -g vercel
vercel
# Follow prompts, ensure VITE_API_BASE_URL points to deployed backend
```

### Deploy Backend (Railway/Heroku)
```bash
cd server
# Create account on Railway or Heroku
# Set environment variables in dashboard
# Connect GitHub repo and deploy
```

### Use MongoDB Atlas for production database

## Future Enhancements

- [ ] Social sharing of achievements
- [ ] Team collaboration features
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] Gamification (badges, levels)
- [ ] Integration with Google Calendar
- [ ] Offline functionality with PWA
- [ ] AI-powered productivity insights
- [ ] Settings to customize Pomodoro duration
- [ ] Goal templates and suggestions

## License

MIT License - Open source and free to use

## Support

For issues or questions:
1. Check Troubleshooting section
2. Review code comments
3. Check GitHub issues
4. Contact maintainers

## Created with 💙 for Students

Focus. Build. Succeed. 🚀

---

**Happy focusing! 🎯**
