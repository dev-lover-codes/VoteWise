# VoteWise — Interactive Election Education Assistant

![VoteWise](https://via.placeholder.com/1200x600.png?text=VoteWise+-+Shape+India's+Future)

**VoteWise** is a production-ready, interactive web application designed to educate Indian citizens, especially first-time voters, about the democratic election process. It uses AI, 3D elements, and modern UX design to make civic education engaging and accessible.

Built for **PromptWars 2026**.

## 🌟 Features

- **AI Chat Assistant:** Ask any election-related questions and get accurate, ECI-guideline-based answers powered by Claude 3.5 Sonnet.
- **Interactive Timeline:** Follow the step-by-step journey of how India votes, from notification to results.
- **Knowledge Quizzes:** Test your understanding across Beginner, Intermediate, and Advanced categories.
- **Myth Buster:** Separate fact from fiction regarding EVMs, NOTA, and voting rights.
- **User Profiles & Leaderboard:** Sign in to save your quiz progress and compete with others.
- **Dark Mode Support:** Beautifully crafted light and dark themes.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS v3, Framer Motion (Animations), Glassmorphism UI
- **Database & Auth:** Supabase (PostgreSQL), Firebase Auth (Google Sign-in)
- **AI Integration:** Anthropic Claude API (claude-3-5-sonnet-20241022)
- **3D Elements:** Spline Viewer
- **Icons:** Lucide React

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/votewise.git
cd votewise
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Copy the `.env.example` to `.env` and fill in your API keys:
```bash
cp .env.example .env
```
Ensure you have API keys from:
- Firebase (for Authentication)
- Supabase (for Database storage)
- Anthropic (for Claude AI)

### 4. Run the development server
```bash
npm run dev
```

## 📦 Deployment (Vercel)

This project is optimized for deployment on Vercel. 
1. Connect your GitHub repository to Vercel.
2. Add the environment variables from your `.env` file into the Vercel dashboard.
3. Deploy!

*Note: The `vercel.json` is included to handle React Router client-side routing.*