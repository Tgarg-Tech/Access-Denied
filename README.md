# 🚀 HackMate

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

**HackMate** is a focused web platform designed to help hackathon participants find, evaluate, and form high-performing teams quickly. By pairing participants based on technical skills, soft skills, interests, and missing roles, HackMate eliminates the friction of team formation and produces balanced, competitive groups.

---

## 📖 Overview

### The Problem

Hackathon participants often spend excessive time finding teammates or end up in unbalanced groups. This scramble for members reduces productivity, leads to skill gaps, and lowers the chance of producing a competitive submission.

### The Solution

HackMate reduces team-formation friction by:

- Allowing participants to build skill-rich profiles backed by **Verification Artifacts**.
- Discovering hackathons and matching candidates using a **transparent scoring model**.
- Highlighting missing roles within existing teams and suggesting the exact members needed to fill those gaps.

---

## ✨ Core Features (MVP)

- **🔍 Smart Team Finder:** Generate ranked teammate suggestions for an individual based on the specific context of a hackathon.
- **🧩 Role Suggestion Engine:** Automatically identify missing technical or soft-skill roles in an existing team and recommend members to cover them.
- **🛡️ Skill Verification:** Build trust by allowing users to verify skills via GitHub, resumes, project links, or certificates.

---

## 🧠 The Matching Algorithm

HackMate uses an explainable, weighted heuristic to compute a **Compatibility Score** from multiple signals. This ensures the matching logic is transparent and easy to justify.

> **S = (w₁ _ Complementarity) + (w₂ _ VerifiedSkillMatch) + (w₃ _ InterestOverlap) + (w₄ _ RoleUrgency) + (w₅ \* SoftSkillFit)**

- **Skill Complementarity:** Rewards combinations that cover necessary roles (e.g., Frontend + Backend + AI/ML).
- **Verified Proficiency:** Applies a multiplier boost to skills backed by verification artifacts.
- **Interest Overlap:** Favors candidates aligned with the specific hackathon theme.
- **Role Coverage:** Penalizes redundant profiles and rewards filling urgent team gaps.
- **Soft-Skill Fit:** Considers collaboration preferences and leadership availability.

---

## 🛤️ User Flow

**Landing Page** ➔ **Hackathon Dashboard** ➔ **Hackathon Details** ➔ **Matching Page** ➔ **Team Page**

1.  **Landing Page:** Value statement and CTAs to create a profile or explore events.
2.  **Hackathon Dashboard:** Search and filters; event cards with key metadata.
3.  **Hackathon Details:** Rules, dates, prize pools, team sizes, and the Apply/Join action.
4.  **Matching Page:** Ranked matches, compatibility scores, reason snippets, and invite actions.
5.  **Team Page:** Current members, pending invites, overall readiness score, and suggested members.

---

## 🏗️ Architecture & Data Model

### Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js / Express API (Conceptual/Mocked for MVP)
- **Database:** PostgreSQL / MongoDB (Conceptual)

### Directory Structure (Frontend)

```text
src/
├── components/      # Reusable UI (Navbar, MatchCard, SkillVerificationModal)
├── pages/           # Core views (LandingPage, HackathonDashboard, TeamPage)
├── contexts/        # App state (ThemeContext.tsx)
└── assets/          # Static files and icons
```
