# Gamified Code Review Tool

A full-stack web application built for the Let'sUpgrade Web Development Hackathon 2025.  
This platform gamifies the coding practice and review process — learners solve coding challenges, submit solutions, and receive instant validation.  
Points, badges, and leaderboards encourage continuous learning and competition.

---

🚀 **Live Demo**  
👉 Deployed on Vercel  

📂 **GitHub Repository**  

👉 [Project Repo](https://github.com/Shreenath-14/Gamified-Code-Review-Tool.git)  

---

## 📌 Features

👨‍💻 **Code Editor** — Monaco-based editor for solving challenges  
✅ **Sandboxed Validation** — Runs user code against predefined test cases in a safe VM  
🔑 **Authentication** — Secure login via Google/GitHub (NextAuth)  
🏆 **Gamification** — XP points, solved counter, streaks, and leaderboard  
📊 **Dashboard** — Track user stats (rank, points, solved challenges)  
☁️ **Database** — Supabase (Postgres) for scalable challenge and user storage  
🌐 **Deployment** — Live on Vercel (serverless + DB on Supabase)  

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS  
- **Backend**: Next.js API Routes (Node.js, vm sandbox for validation)  
- **Database**: Supabase (Postgres, JSON test cases for each challenge)  
- **Authentication**: NextAuth.js (Google + GitHub)  
- **Code Editor**: Monaco (VS Code editor in browser)  
- **Deployment**: Vercel + Supabase Cloud  

---

## ⚙️ Setup Instructions

### 1. Clone this repo

git clone https://github.com/Shreenath-14/Gamified-Code-Review-Tool.git
cd gamified-code-review-tool

### 2. Install dependencies
   
npm install

### 3. Create .env.local file and add:

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key (server-only)

### 4. Run development server

npm run dev


Visit 👉 http://localhost:3000

-------

### 🚧 Key Challenges & Solutions

Safe code execution: Solved by running user code in a Node.js VM sandbox with timeout.

Gamification logic: Implemented XP, streaks, and leaderboard with Supabase tables.

Scalable challenge storage: Moved challenges to Supabase DB (100+ problems supported).

Interactive UI: Used Monaco Editor for in-browser coding experience (like VS Code).

### 📊 Hackathon Deliverables

✅ Live Demo Link (Vercel)
✅ GitHub Repository (this repo
)
✅ 10-Slide Project Presentation (attached separately)


