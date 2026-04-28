# VoteWise Blueprint

VoteWise is an interactive election process education assistant designed for Indian voters, focusing on first-time voters and students. It provides a modern, interactive, and AI-powered experience to demystify democracy.

## Project Identity
- **Name:** VoteWise
- **Tagline:** Your guide to India's democracy
- **Target:** First-time voters, students, and Indian citizens
- **Context:** Indian Election Commission (ECI) guidelines
- **Repository:** [https://github.com/dev-lover-codes/VoteWise.git](https://github.com/dev-lover-codes/VoteWise.git)

## Design System
- **Colors:** 
  - Primary: `#1B2F5E` (Navy)
  - Accent: `#FF6B00` (Saffron)
  - Success: `#1A6B3A` (Green)
  - Background: `#F8F9FC` (Light), `#0D1B3E` (Dark)
- **Fonts:** Poppins (Headings), Inter (Body)
- **Style:** Glassmorphism, 3D depth, mobile-first responsive

## Tech Stack
- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS v4
- **Auth:** Firebase Auth
- **Database:** Supabase (PostgreSQL)
- **AI:** Claude API (Anthropic)
- **Animations:** Framer Motion
- **3D:** Spline
- **Data Viz:** Recharts
- **i18n:** react-i18next

## App Structure & Features

### Core Routes
1.  **Home (`/`):** Hero section with Spline 3D ballot box, feature cards, and CTAs.
2.  **AI Chat (`/chat`):** Election Assistant powered by Claude with ECI-specific system prompt.
3.  **Timeline (`/timeline`):** 8-stage interactive vertical timeline of the election process.
4.  **Quiz (`/quiz`):** 3 categories (Basics, Process, Rights) with 30 questions and leaderboard.
5.  **Myths (`/myths`):** 8 common myths busted with AI-powered fact-checking input.
6.  **Auth (`/auth`):** Firebase-powered login with state/profile sync to Supabase.
7.  **Profile (`/profile`):** User stats, quiz history, and achievement badges.

### Extended Features
8.  **Mock EVM (`/mock-evm`):** Interactive practice session for casting a vote on a simulated machine.
9.  **Form 6 Wizard (`/form6-guide`):** Step-by-step assistant for new voter registration.
10. **Constituency Insights (`/constituency`):** Historical data and charts for specific constituencies.

## Database Schema (Supabase)
- `users_profile`: ID, name, email, avatar, state, age, streak, total_points.
- `quiz_attempts`: User ID, topic, score, percentage, time taken.
- `chat_history`: User ID (nullable), session ID, role, message.
- `myth_feedback`: User ID, myth ID, was_helpful.
- `badges`: ID, name, description, icon_url.
- `user_badges`: User ID, badge ID, awarded_at.

## Implementation Steps
1.  **Environment Setup:** Install new dependencies (`recharts`, `i18next`, etc.).
2.  **Database Migration:** Create/update tables in Supabase with RLS.
3.  **Localization:** Setup `i18n` for English and Hindi.
4.  **UI Core:** Build out the Glassmorphism components and Nav/Footer.
5.  **Feature Implementation:** Build each screen iteratively.
6.  **Gamification:** Integrate the badges and streak logic.
7.  **Final Polish:** Dark mode refinement and responsive testing.
