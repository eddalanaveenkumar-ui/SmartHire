# 🚀 SmartHire - AI-Powered Job Portal

<div align="center">

![SmartHire Logo](client/public/favicon.svg)

**A production-ready, AI-powered job portal built with the MERN Stack**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.17-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Database Setup (MongoDB Atlas)](#4-database-setup-mongodb-atlas)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [AI Integration](#-ai-integration)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

**SmartHire** is a full-featured, AI-powered job portal that connects **candidates**, **recruiters**, and **administrators** on a single platform. It leverages the **MERN Stack** (MongoDB, Express.js, React, Node.js) with **OpenAI/Gemini API** integration to provide intelligent job recommendations, resume analysis, and smart candidate ranking.

Whether you're a job seeker looking for your next opportunity or a recruiter hunting for top talent, SmartHire streamlines the entire hiring process with modern UI/UX and AI-powered insights.

---

## ✨ Features

### 👤 Candidate Features
| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Register/Login with JWT, password encryption via bcrypt |
| 👤 **Profile Management** | Update personal details, upload profile picture |
| 📄 **Resume Upload** | Upload PDF/DOC resumes with Multer |
| 🎯 **Skills & Education** | Add skills, education history, work experience |
| 🔍 **Browse Jobs** | Search, filter, and explore job listings |
| 📌 **Save Jobs** | Bookmark jobs for later review |
| 📋 **Apply for Jobs** | Submit applications with one click |
| 📊 **Track Applications** | Monitor application status in real-time |
| 🤖 **AI Recommendations** | Get personalized job recommendations |
| 📈 **Skill Matching** | See match percentage with job requirements |

### 🏢 Recruiter Features
| Feature | Description |
|---------|-------------|
| 🔐 **Recruiter Auth** | Dedicated signup/login with role-based access |
| 📝 **Post Jobs** | Create detailed job listings |
| ✏️ **Manage Jobs** | Edit, update, or delete job postings |
| 👥 **View Applicants** | See all candidates who applied |
| ✅ **Shortlist/Reject** | Manage applicant pipeline |
| 📄 **View Resumes** | Download and review candidate resumes |
| 🔍 **Filter Applicants** | Filter by skills and qualifications |
| 🤖 **AI Applicant Ranking** | Smart ranking based on skill match |
| 📊 **Analytics** | Track job performance and applicant metrics |

### 🛡️ Admin Features
| Feature | Description |
|---------|-------------|
| 📊 **Admin Dashboard** | Platform-wide analytics overview |
| 👥 **User Management** | Manage candidates and recruiters |
| 🚫 **Ban/Unban Users** | Moderate platform access |
| 🗑️ **Delete Accounts** | Remove problematic users |
| 📈 **Reports & Analytics** | Charts, graphs, and platform statistics |
| 🤖 **AI Usage Monitoring** | Track AI API usage |

### 🤖 AI-Powered Features
- **Job Recommendations** — Personalized jobs based on candidate profile and skills
- **Resume Analysis** — Extract skills, score resumes, suggest improvements
- **Career Guidance** — AI-powered career path suggestions
- **Candidate-Job Matching** — Smart match percentage calculation
- **Applicant Ranking** — Rank candidates by relevance to job requirements

### 🎨 UI/UX Highlights
- 🪟 **Glassmorphism Design** — Modern frosted-glass UI elements
- 🌓 **Dark/Light Mode** — Toggle between themes
- ✨ **Framer Motion** — Smooth animations and transitions
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🧩 **Loading Skeletons** — Beautiful loading states
- 🔔 **Toast Notifications** — Real-time feedback
- 📊 **Interactive Charts** — Recharts for analytics
- 🎯 **Professional Layouts** — Dashboard sidebar navigation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [React 18](https://reactjs.org/) | UI library |
| [Vite 5](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Axios](https://axios-http.com/) | HTTP client |
| [React Hot Toast](https://react-hot-toast.com/) | Notifications |
| [Recharts](https://recharts.org/) | Charts & analytics |
| [Lucide React](https://lucide.dev/) | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org/) | Runtime environment |
| [Express.js](https://expressjs.com/) | Web framework |
| [MongoDB + Mongoose](https://mongoosejs.com/) | Database & ODM |
| [JWT](https://jwt.io/) | Authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Multer](https://github.com/expressjs/multer) | File uploads |
| [Helmet](https://helmetjs.github.io/) | Security headers |
| [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit) | Rate limiting |
| [Socket.io](https://socket.io/) | Real-time features |
| [OpenAI API](https://openai.com/api/) | AI integration |

### Database
- **MongoDB Atlas** (cloud) or **MongoDB Community** (local)
- Mongoose ODM with schemas, validations, and indexes

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React + Vite)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Public    │  │ Candidate│  │ Recruiter / Admin    │  │
│  │ Pages     │  │ Dashboard│  │ Dashboards           │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
│                        │                                │
│              ┌─────────▼─────────┐                      │
│              │   Axios API Calls  │                      │
│              └─────────┬─────────┘                      │
└────────────────────────┼────────────────────────────────┘
                         │ REST API (JSON)
┌────────────────────────┼────────────────────────────────┐
│              ┌─────────▼─────────┐                      │
│              │   Express Server   │                      │
│              │   (Port 5000)     │                      │
│              └─────────┬─────────┘                      │
│         ┌──────────────┼──────────────┐                 │
│    ┌────▼────┐   ┌─────▼─────┐  ┌───▼────┐             │
│    │ Auth    │   │ Job       │  │ AI     │             │
│    │ Routes  │   │ Routes    │  │ Routes │             │
│    └────┬────┘   └─────┬─────┘  └───┬────┘             │
│         └──────────────┼──────────────┘                 │
│                   ┌────▼────┐                          │
│                   │ MongoDB  │                          │
│                   └─────────┘                          │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ (recommended: v20 or v22) — [Download](https://nodejs.org/)
- **npm** v9+ (comes with Node.js)
- **Git** — [Download](https://git-scm.com/downloads)
- **MongoDB Atlas** account (free tier) — [Sign Up](https://www.mongodb.com/cloud/atlas)
- **OpenAI API key** (optional, for AI features) — [Get Key](https://platform.openai.com/api-keys)

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/eddalanaveenkumar-ui/SmartHire.git
cd SmartHire
```

### 2. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install all backend dependencies
npm install

# Create your environment variables file
cp .env.example .env
```

> **⚠️ Important:** Open the `.env` file and fill in your actual values (see [Environment Variables](#-environment-variables) section below).

### 3. Frontend Setup

Open a **new terminal** (keep the backend running):

```bash
# Navigate to the client directory
cd client

# Install all frontend dependencies
npm install
```

### 4. Database Setup (MongoDB Atlas)

Follow these steps to set up your MongoDB database:

#### Option A: MongoDB Atlas (Cloud — Recommended)

1. **Create an Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a new cluster** (the free M0 tier is sufficient)
3. **Create a database user:**
   - Go to **Database Access** → **Add New Database User**
   - Set username and password (save these for the connection string)
   - Set privileges to **Read and write to any database**
4. **Configure Network Access:**
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) for development
5. **Get your connection string:**
   - Go to **Databases** → Click **Connect** → **Drivers**
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smarthire?retryWrites=true&w=majority`)
   - Replace `<username>` and `<password>` with your database user credentials
   - **Do not modify the rest of the string**
6. **Paste** this string as the `MONGO_URI` value in your `server/.env` file

#### Option B: MongoDB Community (Local)

1. **Download and install** MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. **Start the MongoDB service:**
   - **Windows:** Run `net start MongoDB` or start from Services
   - **macOS:** Run `brew services start mongodb-community`
   - **Linux:** Run `sudo systemctl start mongod`
3. Use the following connection string in your `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/smarthire
   ```

---

## 🔐 Environment Variables

Create a `server/.env` file by copying `.env.example`:

```env
# ==================== Server Configuration ====================

# Port the backend server runs on
PORT=5000

# ==================== MongoDB Connection ====================
# Local:  mongodb://localhost:27017/smarthire
# Atlas:  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smarthire?retryWrites=true&w=majority
MONGO_URI=mongodb://localhost:27017/smarthire

# ==================== JWT Authentication ====================
# Generate a strong random secret key
# You can generate one using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# ==================== AI Integration (Optional) ====================
# Get your API key from: https://platform.openai.com/api-keys
# Without this, AI features will use simulated fallback responses
OPENAI_API_KEY=your_openai_api_key_here

# ==================== Environment ====================
NODE_ENV=development

# ==================== Client URL (for CORS) ====================
# In development, Vite runs on port 5173
CLIENT_URL=http://localhost:5173
```

### Generating a Strong JWT Secret

Run this command to generate a cryptographically secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on **http://localhost:5000** with nodemon (auto-restarts on changes).

Expected output:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

### Start the Frontend Dev Server

Open a **second terminal**:

```bash
cd client
npm run dev
```

The frontend will start on **http://localhost:5173**.

Expected output:
```
VITE v5.4.x  ready in 300 ms
  ➜  Local:   http://localhost:5173/
```

### Access the Application

- 🌐 **Frontend:** [http://localhost:5173](http://localhost:5173)
- 🔌 **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)

### Available npm Scripts

| Script | Directory | Command | Description |
|--------|-----------|---------|-------------|
| `dev` | `server/` | `nodemon server.js` | Start backend with auto-restart |
| `start` | `server/` | `node server.js` | Start backend for production |
| `dev` | `client/` | `vite` | Start frontend dev server |
| `build` | `client/` | `vite build` | Build frontend for production |
| `preview` | `client/` | `vite preview` | Preview production build locally |

### Troubleshooting

**Port already in use:**
```bash
# Kill the process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Node process cleanup:**
```bash
# Kill all node processes (Windows)
taskkill /F /IM node.exe
```

**MongoDB connection refused:**
- Ensure MongoDB is running (Atlas cluster is active or local service is started)
- Verify your `MONGO_URI` in `.env` is correct
- Check network access in Atlas (add `0.0.0.0/0` for development)

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| POST | `/api/auth/register` | Register new user (candidate/recruiter) | ❌ |
| POST | `/api/auth/login` | Login and receive JWT token | ❌ |
| GET | `/api/auth/profile` | Get current user profile | ✅ |

### Job Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| GET | `/api/jobs` | Get all jobs (with search/filter) | ❌ |
| GET | `/api/jobs/:id` | Get single job details | ❌ |
| POST | `/api/jobs` | Create a new job | ✅ (Recruiter) |
| PUT | `/api/jobs/:id` | Update a job | ✅ (Recruiter) |
| DELETE | `/api/jobs/:id` | Delete a job | ✅ (Recruiter) |
| GET | `/api/jobs/my-jobs` | Get recruiter's own jobs | ✅ (Recruiter) |

### Application Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| POST | `/api/applications/:jobId` | Apply for a job | ✅ (Candidate) |
| GET | `/api/applications/my-applications` | Get candidate's applications | ✅ (Candidate) |
| GET | `/api/applications/job/:jobId` | Get applicants for a job | ✅ (Recruiter) |
| GET | `/api/applications/:id` | Get single application details | ✅ |
| PUT | `/api/applications/:id/status` | Update application status | ✅ (Recruiter) |
| GET | `/api/applications/stats` | Get application statistics | ✅ (Recruiter) |

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| GET | `/api/ai/recommendations` | Get AI job recommendations | ✅ (Candidate) |
| POST | `/api/ai/analyze-resume` | Analyze resume with AI | ✅ |
| POST | `/api/ai/rank-applicants` | Rank applicants by job match | ✅ (Recruiter) |
| POST | `/api/ai/career-advice` | Get AI career guidance | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| GET | `/api/admin/users` | Get all users | ✅ (Admin) |
| PUT | `/api/admin/users/:id/ban` | Ban/unban a user | ✅ (Admin) |
| DELETE | `/api/admin/users/:id` | Delete a user | ✅ (Admin) |
| GET | `/api/admin/stats` | Get platform statistics | ✅ (Admin) |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| GET | `/api/notifications` | Get user notifications | ✅ |
| PUT | `/api/notifications/:id/read` | Mark notification as read | ✅ |

---

## 📁 Project Structure

```
SmartHire/
├── client/                          # Frontend (React + Vite)
│   ├── public/
│   │   └── favicon.svg              # App favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   │   └── Footer.jsx       # Footer component
│   │   │   ├── candidate/
│   │   │   ├── recruiter/
│   │   │   └── admin/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state
│   │   │   └── ThemeContext.jsx      # Dark/light mode
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── candidate/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── AppliedJobs.jsx
│   │   │   │   ├── SavedJobs.jsx
│   │   │   │   └── RecommendedJobs.jsx
│   │   │   ├── recruiter/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── PostJob.jsx
│   │   │   │   ├── ManageJobs.jsx
│   │   │   │   ├── ApplicantsList.jsx
│   │   │   │   └── CandidateDetails.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── UserManagement.jsx
│   │   │       └── Analytics.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios API service
│   │   ├── App.jsx                  # Root app with routes
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind + global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                          # Backend (Express.js)
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   ├── jobController.js         # Job CRUD logic
│   │   ├── applicationController.js # Application logic
│   │   ├── aiController.js          # AI integration logic
│   │   ├── adminController.js       # Admin logic
│   │   └── notificationController.js
│   ├── middleware/
│   │   └── auth.js                  # JWT + role middleware
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Job.js                   # Job schema
│   │   ├── Application.js           # Application schema
│   │   ├── AIRecommendation.js      # AI recs schema
│   │   └── Notification.js          # Notification schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   ├── ai.js
│   │   ├── admin.js
│   │   └── notifications.js
│   ├── utils/
│   │   ├── AppError.js              # Custom error class
│   │   ├── generateToken.js         # JWT token generator
│   │   └── upload.js                # Multer file upload config
│   ├── uploads/                     # Uploaded files directory
│   ├── server.js                    # Entry point
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   └── package.json
│
├── .gitignore                       # Git ignore rules
├── README.md                        # This file
└── LICENSE                          # License file
```

---

## 🌐 Deployment

### Frontend — Vercel / Netlify

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client directory
cd client

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard:
- None needed for frontend (API URL is configured in `api.js`)

#### Netlify
1. Build the frontend: `cd client && npm run build`
2. Drag and drop the `client/dist` folder to Netlify
3. Set the publish directory to `client/dist`

### Backend — Render / Railway

#### Render
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all environment variables from `.env`
5. Deploy

#### Railway
1. Create a new project on Railway
2. Connect your GitHub repository
3. Set the root directory to `server`
4. Add environment variables
5. Deploy

### MongoDB Atlas (Cloud Database)
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get your connection string
3. Set it as `MONGO_URI` in your deployment platform

---

## 🤖 AI Integration

SmartHire integrates with **OpenAI API** (or you can swap to Gemini) for intelligent features:

### How AI Works

The AI module (`server/controllers/aiController.js`) provides:

1. **Job Recommendations** — Analyzes candidate's skills, experience, and preferences to recommend matching jobs
2. **Resume Analysis** — Extracts skills from resume text, scores resume quality, and suggests improvements
3. **Career Guidance** — Provides personalized career advice based on profile
4. **Applicant Ranking** — Ranks job applicants by how well their skills match job requirements

### Fallback Mode

If no `OPENAI_API_KEY` is set, the AI features automatically fall back to **simulated responses** so the app remains fully functional for development and testing.

### Getting an OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Copy the key and paste it as `OPENAI_API_KEY` in `server/.env`

> **Note:** OpenAI API usage has associated costs. The free trial credits ($5-18) are usually sufficient for development and testing.

---

## 👥 User Roles

The application has three user roles with different permissions:

| Role | Capabilities |
|:----:|-------------|
| 🧑‍💼 **Candidate** | Browse jobs, apply, save jobs, manage profile, upload resume, get AI recommendations |
| 🏢 **Recruiter** | Post/manage jobs, view applicants, shortlist/reject candidates, AI ranking |
| 🛡️ **Admin** | Manage all users, view platform analytics, ban/unban users, monitor AI usage |

### Test Credentials (seed data needed)

After setting up, you can register users via the signup page. There are no seed scripts — simply visit `/signup` and create accounts with the appropriate role.

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| 🏠 **Home** | Hero section, featured jobs, stats counter, AI highlights |
| 🔍 **Jobs** | Search bar, filters, job cards with match percentage |
| 📄 **Job Details** | Full job description, apply button, company info |
| 👤 **Candidate Dashboard** | Overview, stats, recent activity, recommended jobs |
| 📊 **Recruiter Dashboard** | Job performance, applicant stats, charts |
| 🛡️ **Admin Dashboard** | Platform analytics, user metrics, system health |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

Please ensure your code follows the existing coding standards and includes appropriate comments.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [React](https://reactjs.org/) — UI library
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Recharts](https://recharts.org/) — Charts
- [Lucide Icons](https://lucide.dev/) — Icons
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Cloud database
- [OpenAI](https://openai.com/) — AI API

---

<div align="center">

**Built with ❤️ by [Naveen Kumar](https://github.com/eddalanaveenkumar-ui)**

*Happy Hiring! 🎯*

</div>
