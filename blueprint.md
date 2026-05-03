# Project Blueprint: Election Awareness App

## Overview
An interactive web application designed to enhance civic awareness and voter education in India. The app features educational modules like a Mock EVM, Form 6 registration guide, election timelines, and AI-powered chat for voter queries.

## Project Identity
- **Name:** VoteWise
- **Tagline:** Your guide to India's democracy
- **Target:** First-time voters, students, and Indian citizens
- **Context:** Indian Election Commission (ECI) guidelines
- **Repository:** [https://github.com/dev-lover-codes/VoteWise.git](https://github.com/dev-lover-codes/VoteWise.git)

## Project Details & Features

### Core Features
- **Home:** Landing page with key highlights and quick access to modules.
- **Chat:** AI-powered assistant to answer election-related questions.
- **Timeline:** Interactive timeline of important election dates and historical milestones.
- **Quiz:** Educational quizzes to test knowledge about the Indian electoral system.
- **Myths:** Fact-checking section to debunk common election-related misinformation.
- **Mock EVM:** A simulation of an Electronic Voting Machine to familiarize voters with the process.
- **Form 6 Guide:** Step-by-step guidance for new voter registration.
- **Constituency Insights:** Data and insights about various constituencies.
- **Profile:** User profile management and progress tracking.

### Tech Stack
- **Frontend:** React (TypeScript), Vite
- **Styling:** Tailwind CSS, Framer Motion for animations
- **State Management:** React Context API (AuthContext)
- **Backend/Services:** Firebase, Supabase
- **Design System:** (To be defined in Stitch)

---

## Codebase Mapping (Graphify) - COMPLETED
The project has been mapped and documented in `.planning/codebase/`.
- [x] **STACK.md**: React 19, Vite 8, TypeScript, Firebase, Supabase, Gemini AI.
- [x] **STRUCTURE.md**: Detailed directory layout and file responsibilities.
- [x] **ARCHITECTURE.md**: Modular SPA patterns with Context API and service abstraction.
- [x] **INTEGRATIONS.md**: Deep dive into Firebase, Supabase, and Gemini API.
- [x] **CONVENTIONS.md**: PascalCase components, camelCase utilities, utility-first CSS.
- [x] **TESTING.md**: Current manual status and future automated strategy.
- [x] **CONCERNS.md**: Tech debt, error handling, and AI hallucination risks.

A visual architecture graph has been generated: [project_graph.md](file:///C:/Users/Faiz/.gemini/antigravity/brain/fac66e1b-c34b-4b40-ade4-a90017e83601/project_graph.md)

---

## Stitch Panel Generation Plan

### 1. Design System Initialization
- **Primary Color:** Indian Saffron (#FF9933) or Deep Saffron.
- **Secondary Color:** India Green (#138808).
- **Typography:** Expressive and clear fonts (e.g., Manrope or Inter).
- **Theme:** Light/Dark mode support.

### 2. Screen Generation Tasks
I will generate the following panels in Stitch:
1. **Home Screen:** Hero section with "Vote India" theme.
2. **Chat Interface:** Clean messaging UI with AI personality.
3. **Timeline View:** Vertical or horizontal scrollable timeline.
4. **Quiz Panel:** Interactive question/answer cards with feedback.
5. **Mock EVM:** Realistic representation of the EVM panel.
6. **Form 6 Guide:** Multi-step wizard UI.
7. **Auth Pages:** Modern login/signup with social options.

### 3. Implementation Steps (Post-Design)
- Review designs in Stitch.
- Export/Reference design tokens.
- Apply design system to existing React components.
- Update UI logic to match new design patterns.

## Deployment
- **Platform:** Google Cloud Run
- **Region:** us-central1
- **Service URL:** [https://election-awareness-738373994270.us-central1.run.app](https://election-awareness-738373994270.us-central1.run.app)
- **Deployment Method:** Containerized (Docker + Nginx)
