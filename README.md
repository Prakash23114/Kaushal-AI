# Kaushal AI — Your Personal AI Interview Coach
> **Prepare Smarter. Interview Better. Get Hired.**

An intelligent, full-stack AI interview preparation platform designed for students, software engineers, and job seekers. Kaushal AI uses your resume, target job descriptions, and Google Gemini AI to formulate personalized interview strategies, real-time coaching, interactive mock interviews with speech & camera, curated DSA & Aptitude practice, project defense drills, and ATS-optimized resume PDFs.

---

## 🌟 Key Highlights & Features

### 1. AI Interview Strategy Generator
- **Multi-Stage Animated Loader**: Real-time visual progress through 7 stages:
  1. Analyzing Resume PDF & extracting core skills
  2. Understanding Target Job Description requirements
  3. Comparing candidate capabilities against role standards
  4. Generating realistic technical interview questions
  5. Formulating STAR behavioral scenario frameworks
  6. Synthesizing personalized 14-day preparation roadmap
  7. Finalizing customized Kaushal AI strategy
- **Dynamic Resume Management**: Seamlessly use your stored profile resume or upload a new/different resume. When a new resume is uploaded, the candidate profile, skills, projects, and target role are automatically updated so subsequent mock interviews reflect the new strategy with **zero stale data**.

### 2. AI Mock Interview Room (Camera + Voice + DSA)
- **Role-Aware & Strategy-Grounded**: Automatically defaults to your active interview strategy (or allows switching between multiple strategies).
- **Balanced DSA & System Questions**: Every interview session blends:
  - **DSA Conceptual Questions**: Time/space complexity trade-offs, data structure choices (Hash Tables vs Balanced BSTs, DAGs, etc.).
  - **DSA Problem-Solving Questions**: Algorithmic problem design, sliding window, two pointers, interval scheduling, dynamic programming.
  - **System Architecture & Technical Depth**: Concurrency, caching, database indexing, and backend/frontend lifecycle.
  - **Resume Project Defense**: Direct questions challenging tech stack decisions and scaling to 10k+ concurrent users.
  - **Behavioral & Incident Scenarios**: STAR-framework evaluation and production outage troubleshooting.
- **Live Camera Preview**: Optional video stream tile with live preview, mirror view, *"LIVE FEED"* indicator, and clean hardware stream cleanup when toggling off or leaving the room.
- **Speech-to-Text Voice Dictation**: Powered by the Web Speech API. Candidates can dictate their answers in real-time, view live transcription without word duplication, freely edit the text, and submit for multi-dimensional AI scoring.
- **Robust Scoring & Feedback**: Evaluates Overall Score, Technical Accuracy, Communication, Answer Structure, Perceived Confidence (`High`, `Moderate`, `Needs Improvement`, `Low`), Missing Points, and an Ideal Answer Approach.

### 3. Curated Question Bank
Organized strictly into two primary categories with dynamic subcategory filters:
- **Category A: Aptitude**:
  - *Numerical Ability*: Percentages, Profit & Loss, Speed/Time/Work, Probability & Permutations.
  - *Verbal Ability*: Sentence Correction, Critical Reasoning, Reading Comprehension inferences.
  - *Reasoning Ability*: Syllogisms, Blood Relations, Seating Arrangements, Coding-Decoding.
- **Category B: Technical (Purely DSA)**:
  - *Arrays*, *Strings*, *Linked Lists*, *Stack*, *Queue*, *Trees*, *Graphs*, *Recursion*, *Sorting*, *Searching*, *Hashing*, *Dynamic Programming*, *Time & Space Complexity*.
- Includes difficulty filters (Beginner, Intermediate, Advanced), real-time search, bookmarking, mark-as-practiced tracking, and expandable optimal solution strategies.

### 4. Unified Candidate Dashboard & Analytics
- **Interview Readiness Score**: Weighted score combining ATS resume benchmark, mock interview evaluations, and practice consistency.
- **Active Practice Streak**: Tracks daily consistency across mock drills and challenges.
- **Competency Radar**: 360° candidate competency analysis across Technical Depth, STAR Communication, Architecture, System Design, and Problem Solving.
- **Priority Weak Areas**: Surfaces specific skill gaps extracted by comparing candidate resumes against job descriptions.
- **Recent Strategies & Sessions**: One-click navigation to continue practicing aligned strategies.

### 5. Kaushal AI Coach
- 24/7 conversational mentor grounded in the candidate's active strategy, target role, resume highlights, and skill gaps.
- Markdown rendering, syntax-highlighted code blocks, copy-to-clipboard buttons, and suggested prompt chips.

### 6. Interactive 14-Day Preparation Roadmap
- Day-by-day structured curriculum (JavaScript, React, Node.js, MongoDB, REST APIs, DSA, System Design, Project Defense, Behavioral STAR, and Full-Loop Mocks) with checkable milestones and persistent progress tracking.

### 7. ATS Resume Diagnostics
- Evaluates ATS compatibility score (0-100%), technical depth, project metrics, missing high-value keywords, and section-by-section actionable fixes.

### 8. Job Description Analyzer
- Extracts core mandatory requirements, preferred bonus skills, day-to-day responsibilities, and generates matching vs missing skill comparisons.

### 9. Daily AI Interview Challenge
- 3 daily questions (1 Technical, 1 Behavioral, 1 Project Defense) with AI grading, streak extension, and confetti celebration.

### 10. Automated ATS Resume PDF Generation
- Compiles an ATS-friendly HTML resume tailored to the target job description and renders a clean, downloadable PDF via Puppeteer.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 8, SCSS Design System, Lucide React, Recharts, Canvas Confetti, React Markdown, Web Speech API, WebRTC MediaStreams |
| **Backend** | Node.js, Express 5, Mongoose, JWT (JSON Web Tokens), bcryptjs, Multer, pdf-parse, Puppeteer |
| **Database** | MongoDB Atlas (Users, CandidateProfile, InterviewReport, InterviewSession, QuestionPractice, UserActivity, BlacklistTokens) |
| **AI Engine** | Google Gemini 3.8 Flash (`@google/genai`) with structured JSON schema enforcement (`zod` & `zod-to-json-schema`) and exponential backoff retry |

---

## 📐 System Architecture

```text
[ Browser / Client ]
      │
      ├── Public Marketing Landing Page (/)
      ├── Authentication (/login, /register)
      ├── Mandatory Onboarding (/app/onboarding)
      └── Protected Application Shell (/app/*)
            ├── Dashboard & Analytics (/app/dashboard)
            ├── Create New Strategy (/app/new-interview)
            ├── AI Coach (/app/coach)
            ├── Mock Interview Room (/app/mock-interview) [Voice + Camera + DSA]
            ├── Resume Analyzer (/app/resume-analyzer)
            ├── Job Analyzer (/app/job-analyzer)
            ├── Curated Question Bank (/app/question-bank) [Aptitude + Pure DSA]
            ├── 14-Day Roadmap (/app/roadmap)
            ├── My Interviews (/app/my-interviews)
            └── Daily Challenge (/app/daily-challenge)
      │
      ▼ (REST APIs with JWT Cookies & Bearer Auth)
[ Express 5 Backend (Port 4000) ]
      │
      ├── Auth Middleware (Token verification & blacklist check)
      ├── File Upload Middleware (Multer in-memory buffer handling)
      ├── pdf-parse (Text extraction from resumes)
      ├── Puppeteer (Headless ATS PDF compilation)
      └── Gemini AI Service Layer (gemini-3.8-flash with retry)
            │
            ├── generateInterviewReport (Structured Zod Schema)
            ├── generateResumeSpecificMockQuestions (Balanced DSA & Strategy questions)
            ├── evaluateMockAnswer (Multi-dimensional scoring & confidence)
            ├── askAiCoach (Context-aware conversational grounding)
            ├── analyzeResumeDetails (ATS & keyword diagnostic)
            ├── analyzeJobDescription (Skill matching engine)
            └── getDailyChallengeQuestions (Dynamic 3-question generator)
      │
      ▼
[ MongoDB Atlas Collections ]
      ├── users (Hashed credentials via bcryptjs)
      ├── candidateprofiles (Resume text, ATS scores, extracted skills & projects)
      ├── interviewreports (Target role, job description, technical/behavioral frameworks)
      ├── interviewsessions (Mock session scores, evaluations, strategy references)
      ├── questionpractices (Practiced & bookmarked questions map)
      ├── useractivities (Streak and activity event tracking)
      └── blacklisttokens (Token invalidation upon logout)
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

## 🔒 Reliability & Consistency Features

- **Strategy-Based Personalization**: Changing strategies immediately updates profile skills and active questions, ensuring zero stale questions from older roles.
- **Mongoose Enum Consistency**: Confidence evaluations accept `High`, `Moderate`, `Needs Improvement`, and `Low` with defensive sanitization to eliminate MongoDB validation errors.
- **Resource Ownership Verification**: Every endpoint ensures `user: req.user.id` matches the document in MongoDB.
- **Authentication Resilience**: Supports both `httpOnly` secure cookies and `Authorization: Bearer <token>` headers.
- **Token Blacklisting**: Logout immediately registers tokens in `blacklistTokens` collection to invalidate sessions.
- **Hardware Permission Safeguards**: Gracefully handles camera and microphone permission denials with clear user feedback.

---

## 📄 License
This project is open-source and intended for student, educational, and developer portfolio use.