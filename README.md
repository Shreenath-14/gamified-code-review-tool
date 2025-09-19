Gamified Code Review Tool

A full-stack web application built for the Let'sUpgrade Web Development Hackathon 2025.
This platform gamifies the code review process — learners solve coding challenges, submit solutions, and receive inline feedback. Points, badges, and leaderboards encourage continuous learning.

---

🚀 Live Demo

👉 Deployed on Vercel

📂 GitHub Repository

👉 Project Repo

---

📌 Features

👨‍💻 Code Editor — Monaco-based editor for solving challenges

✅ Sandboxed Validation — Runs user code against predefined test cases

🔑 Authentication — Secure login via Google/GitHub

🏆 Gamification — Points, badges, and leaderboards to boost engagement

📝 Inline Reviews — Users can leave comments on specific lines of code

☁️ Deployment — Live on Vercel with MongoDB Atlas as backend database

---

🛠️ Tech Stack

Frontend: Next.js, React, Tailwind CSS
Backend: Next.js API Routes (Node.js), vm2 (sandboxed code execution)
Database: MongoDB Atlas + Mongoose
Auth: NextAuth (Google/GitHub)
Deployment: Vercel

---

⚙️ Setup Instructions

1. Clone this repo

git clone https://github.com/your-username/gamified-code-review-tool.git
cd gamified-code-review-tool

2. Install dependencies

npm install

3. Create .env.local file and add:

MONGODB_URI=your_mongo_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

4. Run development server

npm run dev

Visit 👉 http://localhost:3000

---

🔗 API Endpoints

Endpoint	Method	Description

/api/challenges	GET	Fetch all challenges
/api/challenges/:id	GET	Fetch a single challenge
/api/submissions	POST	Submit solution for validation
/api/validate	POST	Run code in sandbox, return results
/api/reviews	POST	Add inline review to a submission
/api/leaderboard	GET	Fetch top users by points

---

💡 Key Challenges & Solutions

Safe code execution: Solved by using vm2 sandbox to isolate and run user code securely.

Gamification design: Implemented a points + badge system to encourage consistent participation.

Interactive UI: Integrated Monaco Editor to provide an in-browser coding experience similar to VS Code.

---

📊 Hackathon Deliverables

✅ Live Demo Link (Vercel)

✅ GitHub Repository (this repo)

✅ 10-Slide Project Presentation (attached separately)
