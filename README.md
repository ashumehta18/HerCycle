# HerCycle — Smart Period & Wellness Tracker

A MERN stack web app to track menstrual cycles, analyze PCOS risk, chat with an AI wellness assistant, and receive automated reminders.

## Stack
- Client: React + Vite + Redux Toolkit + TailwindCSS + Chart.js
- Server: Node.js + Express + Mongoose + JWT + bcrypt + node-cron
- AI: OpenAI API (optional)

## Quick start (Windows PowerShell)

1. Install dependencies

```powershell
# from project root
npm install
```

2. Configure environment

- Copy `server/.env.example` to `server/.env` and fill:
  - `MONGO_URI` (e.g., mongodb://127.0.0.1:27017/hercycle)
  - `JWT_SECRET`
  - `CLIENT_ORIGIN` (default http://localhost:5173)
  - `OPENAI_API_KEY` (optional)

3. Run dev servers (concurrently)

```powershell
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000

## Features implemented
- JWT auth (register/login/profile)
- Period tracker with predictions and chart
- PCOS risk analyzer
- AI chatbot route `/api/chat` (uses OpenAI if key present)
- Reminder scheduler via node-cron (runs daily at 08:00)
- Admin trends API (protected)

## Scripts
- `npm run dev` — run client and server together
- `npm run start` — start server only
- `npm run build` — build client

## Notes
- This project is for educational purposes and not medical advice.
- Add Google Calendar integration, dark mode, and admin UI as next steps.
