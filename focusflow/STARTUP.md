# FocusFlow - Startup Guide

## Quick Start

### From the `focusflow` directory:

```bash
# Install all dependencies
npm run setup

# Start client development server (http://localhost:5173)
npm start
# or
npm run client:dev

# In another terminal, start server (http://localhost:5000)
npm run server:dev
```

### From the `shetech` directory:

```bash
# Install all dependencies
npm run setup

# Start client development server
npm start

# In another terminal, start server
npm run server:dev
```

## Available Scripts

### Root Level (`shetech/`)

- `npm start` - Start client dev server
- `npm run server` - Start server (production mode)
- `npm run server:dev` - Start server (development mode with hot reload)
- `npm run client:dev` - Start client dev server
- `npm run build` - Build client for production

### FocusFlow Level (`shetech/focusflow/`)

- `npm start` - Start client dev server (Vite)
- `npm run dev` - Run both server and client concurrently
- `npm run server` - Start server (production mode)
- `npm run server:dev` - Start server (development mode with nodemon)
- `npm run client:dev` - Start client dev server
- `npm run build` - Build client for production

## Environment Setup

### Server (`.env` file needed)

Create `focusflow/server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://your-database-uri
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### Client (`.env` file needed)

Create `focusflow/client/.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000
```

## Development

- **Frontend**: `http://localhost:5173` (React + Vite)
- **Backend**: `http://localhost:5000` (Node.js + Express)
- **Database**: MongoDB

## Troubleshooting

If you get "Missing script: start" error:
1. Make sure you're running `npm` from either `shetech/` or `shetech/focusflow/` directory
2. Verify `package.json` exists in that directory
3. Run `npm install` to install dependencies
