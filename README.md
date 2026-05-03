# VoteWise — The Ultimate Election Education Assistant

![VoteWise](https://images.unsplash.com/photo-1540910419892-f39712c74066?auto=format&fit=crop&q=80&w=1200&h=600)

**VoteWise** is a state-of-the-art, interactive web application designed to empower Indian citizens, especially first-time voters, with knowledge about the democratic election process. It combines cutting-edge AI, 3D simulations, and premium UI/UX design to make civic education engaging, accessible, and unforgettable.

Built with ❤️ for the world's largest democracy.

## 🌟 Key Features

- **🧠 AI Election Expert:** Real-time conversational AI powered by Google Gemini 1.5 Flash, trained on official ECI guidelines.
- **🗳️ Mock EVM Simulator:** A highly realistic Electronic Voting Machine and VVPAT simulation with audio feedback and receipt verification.
- **🗺️ Interactive Journey:** A dynamic, step-by-step timeline of the Indian election process with deep-dive details.
- **📊 Constituency Insights:** Visualize historical voter turnout and demographic trends with interactive charts.
- **📝 Form 6 Simulator:** Learn how to register as a new voter through a guided, step-by-step registration simulator.
- **⚡ Knowledge Quizzes:** gamified learning across multiple difficulty levels with badge rewards.
- **🛡️ Myth Buster:** Proactively addresses common misconceptions about EVMs, NOTA, and voting rights.
- **🌗 Dark Mode & Glassmorphism:** A premium, modern UI designed for accessibility and visual excellence.

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v3 + Framer Motion (Animations)
- **UI System:** Glassmorphism, Premium Dark Mode, Lucide Icons
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Firebase Auth (Google Integration)
- **AI Engine:** Google Generative AI (Gemini 1.5 Flash)
- **Visuals:** Spline 3D Viewer + Recharts (Data Viz)
- **Tools:** Howler.js (Audio), jsPDF (Report Generation)

## 🚀 Local Development

### 1. Prerequisites
- Node.js (v20+)
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/dev-lover-codes/VoteWise.git
cd VoteWise
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following keys:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### 4. Start Development
```bash
npm run dev
```

## 📦 Deployment

This project is optimized for deployment on Google Cloud Run and Vercel. 

- **Docker:** A `Dockerfile` and `nginx.conf` are included for containerized deployment.
- **Vercel:** Configuration for SPA routing is handled via `vercel.json`.

---
*Disclaimer: VoteWise is an educational tool and is not officially affiliated with the Election Commission of India. Always refer to eci.gov.in for official information.*