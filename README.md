# Kaushal AI — Your Personal AI Interview Coach
> **Prepare Smarter. Interview Better. Get Hired.**

An intelligent, full-stack AI interview preparation platform designed for students, software engineers, and job seekers. Kaushal AI uses your resume, target job descriptions, and Google Gemini AI to formulate personalized interview strategies, real-time coaching, interactive mock interviews, project defense drills, and ATS-optimized resume PDFs.

---

## 🌟 Key Highlights & Features

### 1. Modern SaaS Landing Page
- High-converting hero showcase, trusted feature indicators, 5-step workflow, comprehensive feature cards, and immediate call to action.

### 2. Candidate Dashboard
- **Interview Readiness Score**: Weighted score based on profile alignment and mock drill history.
- **Active Practice Streak**: Tracks daily consistency to build high-performance interview reflexes.
- **Competency Radar**: Real-time evaluation across Technical Depth, STAR Communication, Architecture, System Design, and Problem Solving.
- **Priority Weak Areas**: Surfaces specific skill gaps extracted by comparing candidate resumes against job descriptions.

### 3. AI Interview Strategy Generator
- **Multi-Stage Animated Loader**: Real-time visual progress through 7 stages:
  1. Analyzing Resume PDF & extracting core skills
  2. Understanding Target Job Description requirements
  3. Comparing candidate capabilities against role standards
  4. Generating realistic technical interview questions
  5. Formulating STAR behavioral scenario frameworks
  6. Synthesizing personalized 14-day preparation roadmap
  7. Finalizing customized Kaushal AI strategy
- **Dual-Panel Input**: Drag-and-drop PDF resume upload with validation plus self-description fallback.

### 4. Kaushal AI Coach
- 24/7 conversational mentor grounded in the candidate's target role, resume highlights, and identified skill gaps.
- Markdown rendering, syntax-highlighted code blocks, copy-to-clipboard buttons, and suggested prompt chips.

### 5. AI Mock Interview Room
- Configurable by **Role**, **Type** (Technical, Behavioral, Project Based, HR, Mixed), **Difficulty** (Beginner, Intermediate, Advanced), and **Duration**.
- Voice dictation support via Web Speech API and text input.
- Detailed AI evaluation: Overall Score, Technical Accuracy, Communication, Answer Structure, Missing Points, and Better Answer Approach (no fake praise).

### 6. Project Defense Mode
- Specialized placement simulator to defend personal projects: architecture data flows, tech stack trade-offs, handling 10k concurrent users, security & authentication, and debugging major roadblocks.

### 7. ATS Resume Diagnostics
- Evaluates ATS compatibility score (0-100%), technical depth, project metrics, missing high-value keywords, and section-by-section actionable fixes.

### 8. Job Description Analyzer
- Extracts core mandatory requirements, preferred bonus skills, day-to-day responsibilities, and generates matching vs missing skill comparisons.

### 9. Interactive 14-Day Preparation Roadmap
- Day-by-day structured curriculum (JavaScript, React, Node.js, MongoDB, REST APIs, DSA, System Design, Project Defense, Behavioral STAR, and Full-Loop Mocks) with checkable milestones and persistent progress tracking.

### 10. Curated Question Bank
- Categorized by JavaScript, React, Node.js, MongoDB, System Design, DSA, GenAI, Behavioral, and Projects.
- Filter by topic and difficulty, with expandable concept overviews, model answers, bookmarking, and direct bridge to AI Coach for deep-dives.

### 11. Performance Analytics
- Data visualizations powered by **Recharts**: Weekly readiness trend (AreaChart), practice distribution by technology (BarChart), and 360° candidate competency radar (RadarChart).

### 12. Daily AI Interview Challenge
- 3 daily questions (1 Technical, 1 Behavioral, 1 Project Defense) with AI grading, streak extension, and confetti celebration.

### 13. Automated ATS Resume PDF Generation
- Compiles an ATS-friendly HTML resume tailored to the target job description and renders a clean, downloadable PDF via Puppeteer.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router, SCSS Design System, Lucide React, Recharts, Canvas Confetti, React Markdown |
| **Backend** | Node.js, Express 5, Mongoose, JWT (JSON Web Tokens), bcryptjs, Multer, pdf-parse, Puppeteer |
| **Database** | MongoDB Atlas (Users, Interview Reports, Blacklisted Tokens) |
| **AI Engine** | Google Gemini 3.8 Flash (`@google/genai`) with structured JSON schema enforcement (`zod` & `zod-to-json-schema`) and exponential backoff retry |

---

## 📐 System Architecture

```text
[ Browser / Client ]
      │
      ├── Public Marketing Landing Page (/)
      ├── Authentication (/login, /register)
      └── Protected Application Shell (/app/*)
            ├── Dashboard & Analytics (Recharts)
            ├── AI Coach (Markdown Chat Interface)
            ├── Mock Interview & Project Defense Room
            ├── Resume & Job Description Analyzers
            ├── Interactive 14-Day Roadmap
            └── Question Bank with Bookmarks
      │
      ▼ (REST APIs with JWT Cookies & Bearer Auth)
[ Express 5 Backend (Port 4000) ]
      │
      ├── Auth Middleware (Token verification & blacklist check)
      ├── Ownership Verification (Ensures users only access their own reports)
      ├── Multer (In-memory PDF buffer handling)
      ├── pdf-parse (Text extraction from resumes)
      ├── Puppeteer (Headless ATS PDF compilation)
      └── Gemini AI Service Layer (gemini-3.8-flash with retry)
            │
            ├── generateInterviewReport (Structured Zod Schema)
            ├── askAiCoach (Context-aware conversational grounding)
            ├── evaluateMockAnswer (Multi-dimensional scoring)
            ├── analyzeResumeDetails (ATS & keyword diagnostic)
            ├── analyzeJobDescription (Skill matching engine)
            └── getDailyChallengeQuestions (Dynamic 3-question generator)
      │
      ▼
[ MongoDB Atlas ]
      ├── Users Collection (Hashed passwords via bcryptjs)
      ├── InterviewReports Collection (Full reports, questions, plans)
      └── BlacklistTokens Collection (Secure logout invalidation)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ or v24+)
- **MongoDB** connection string (local or MongoDB Atlas)
- **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))

---

### Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create or verify your `.env` file in `Backend/.env`:
   ```env
   PORT=4000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=interview-ai-cluster
   JWT_SECRET=your_super_secret_jwt_key_here
   GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:4000` with connected MongoDB.*

---

### Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173`.*

4. To build for production:
   ```bash
   npm run build
   ```

---

## 🔒 Security Best Practices Implemented

- **Resource Ownership Verification**: Every endpoint retrieving reports or generating PDFs verifies that `user: req.user.id` matches the document in MongoDB.
- **Authentication Resilience**: Supports both `httpOnly` secure cookies and `Authorization: Bearer <token>` headers.
- **Token Blacklisting**: Logout immediately registers tokens in the `blacklistTokens` collection to invalidate stolen credentials.
- **File Upload Protection**: Multer memory storage validates file size limits (3MB) and restricts accepted types to PDF/DOCX.
- **AI Fault Tolerance**: Automatic exponential backoff retry handles transient Google Gemini high-demand spikes gracefully.

---

## 🎓 Academic & Portfolio Relevance

Kaushal AI is designed for:
- **College Final-Year Capstone Project**: Demonstrates end-to-end full-stack engineering, generative AI integration, database design, and real-world system design.
- **GitHub Portfolio & Resume Demonstration**: Demonstrates modern React architecture, REST APIs, asynchronous job processing, and clean UX.
- **Campus Placement Preparation**: Directly useful for preparing and cracking technical, HR, and project defense rounds.

---

## 📄 License
This project is open-source and intended for student, educational, and developer portfolio use.