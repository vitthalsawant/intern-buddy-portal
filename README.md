# Full Stack Intern Portal (Enhanced & Decorative)

A lightweight, polished intern dashboard with dummy full-stack data, gamification, referral tracking, and smooth UI animations. Built to feel modern and engaging while using static or mocked backend data.

## 🚀 Project Overview

This portal simulates an intern experience with:
- Dashboard showing donations, referral code, unlocked rewards
- Leaderboard (static/dummy)
- Profile & referral sharing
- Gamified achievement system
- Theme toggling (Light/Dark)
- Activity feed and progress tracking

All data is provided via a simple REST API or static JSON. No real authentication—flows are simulated for UX fidelity.

## 🛠 Tech Stack

- **Frontend:** React (or plain HTML/CSS/JS), Tailwind CSS, Framer Motion (for animation)
- **Backend:** Node.js + Express / Firebase / Static JSON (any simple REST provider)
- **Optional Data Store:** Firebase / MongoDB / JSON file (read-only)
- **Dev Tools:** Postman (for mocking), Vite/Create React App, Git

## ✨ Key Features

### Dashboard
- Intern name, referral code, and total donations raised
- Reward badges (locked/unlocked) with hover tooltips
- Donation goal progress bar
- Recent activity feed

### Leaderboard
- Static top interns by donations
- Highlight current user
- Toggle between "This Week" / "All Time" (simulated)

### Profile & Referral
- Editable-looking profile card with avatar placeholder
- Copyable referral code and mock social share buttons

### Theme Switcher
- Light/Dark mode with smooth transition

### Gamification
- Levels (Bronze/Silver/Gold) based on amount raised
- Next milestone preview

### Empty States
- Friendly illustrations and callouts when no data exists


## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/intern-portal.git
cd intern-portal

npm install
2 Start Frontend
npm run dev   # for Vite setup
# OR
npm start     # for Create React App

### Snapshot of Portal

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6392ff50-94c5-4bc1-b564-78e41657c317" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7fb5b5a8-673d-408a-b7e2-a9c2f802face" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7c043f16-9081-4740-9d91-d4abdac83536" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3a1e5648-9f41-4c1a-906d-f7bcdc95165a" />
