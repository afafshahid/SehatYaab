# SehatYaab

> **AI-Powered Emergency Healthcare & Affordable Medicine Ecosystem**

SehatYaab (Urdu: **"Healthy at Last"**) is a full-stack, role-aware healthcare coordination platform designed to address urgent and systemic healthcare access gaps in Pakistan.

It unifies:
- **Real-time emergency blood donor matching**
- **Medicine price intelligence and generic discovery**
- **AI-assisted symptom triage and specialist routing**

Built as an academic, production-grade architecture prototype at **NU (FAST), Karachi**, SehatYaab combines modern web engineering with clinically responsible AI workflows to deliver low-latency, scalable, and security-first healthcare infrastructure.

---

## Table of Contents

- [Problem Context](#problem-context)
- [Core Capabilities](#core-capabilities)
- [Role-Based Dashboards](#role-based-dashboards)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Data Model (High-Level)](#data-model-high-level)
- [Security Model](#security-model)
- [Quick Start](#quick-start)
- [Project Metadata](#project-metadata)
- [Future Roadmap](#future-roadmap)
- [Vision](#vision)

---

## Problem Context

Pakistan’s healthcare ecosystem suffers from three connected coordination failures:

1. **Blood emergency delays** due to fragmented donor discovery
2. **Medicine affordability opacity** caused by unstructured pharmacy pricing
3. **First-response triage gaps** that overload hospitals and delay urgent care

SehatYaab addresses these problems through a single digital coordination layer linking **patients, donors, hospitals, doctors, and pharmacies** in real time.

---

## Core Capabilities

### 1) Emergency Blood Module
- Live emergency blood request board (Firestore real-time subscriptions)
- Urgency-aware prioritization: `critical | high | moderate | low`
- Request lifecycle management: `open -> fulfilled/cancelled`
- Donor availability registration integrated into user health profile

### 2) Medicine Intelligence Module
- Searchable medicine catalog (brand + generic)
- Cross-pharmacy price comparison and stock visibility
- Generic medicine discovery for cost-optimized decisions
- Pharmacy-controlled inventory updates via role-gated dashboard

### 3) AI Health Copilot
- Natural-language symptom intake
- Structured AI output via Gemini 1.5 Flash:
  - probable causes
  - severity classification
  - precautions
  - specialist recommendations
- Physician checkup escalation flow for medium/high-risk outcomes
- Longitudinal user health logs for analysis history

---

## Role-Based Dashboards

SehatYaab is architected as a **multi-stakeholder system**, not a single-user app:

- **Patient / Donor**: health card, blood availability, AI copilot, emergency posting
- **Hospital Admin**: doctor management, blood broadcasting, request oversight
- **Doctor**: checkup queue and consultation workflow
- **Pharmacy**: pricing and stock operations dashboard

---

## Architecture Overview

SehatYaab follows a **three-tier architecture** optimized for real-time interaction and secure data operations:

- **Frontend (SPA):** React + TypeScript + Vite
- **Application Layer:** Express.js REST API
- **Data Layer:** Firebase Auth + Cloud Firestore + Firestore Security Rules
- **AI Layer:** Google Gemini 1.5 Flash via `@google/generative-ai`

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS |
| UI/UX | Framer Motion, Recharts, Lucide React |
| Backend/API | Express.js (Node 18+) |
| Auth | Firebase Auth (Google OAuth + Email/Password) |
| Database | Cloud Firestore |
| Security | Firestore Security Rules |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) |

---

## Data Model (High-Level)

Primary collections:

- `/users/{userId}`
- `/blood_requests/{id}`
- `/medicines/{id}`
- `/pharmacies/{id}/stock/{stockId}`
- `/health_logs/{id}`
- `/checkup_requests/{id}`

This schema is designed for low-latency reads, modular ownership boundaries, and role-based write safety.

---

## Security Model

SehatYaab enforces security at the data layer using Firestore Rules and validation-first payload constraints.

The project includes a hardened negative-test mindset (**"Dirty Dozen"**) against:

- identity spoofing
- privilege escalation
- orphaned references
- status shortcutting
- unauthorized health log access
- role bypass on pharmacy stock
- large payload poisoning
- malicious ID patterns

This ensures access guarantees are **server-enforced**, not client-assumed.

---

## Quick Start

### 1) Clone the repository
```bash
git clone https://github.com/afafshahid/SehatYaab.git
cd SehatYaab
```

### 2) Install dependencies
```bash
npm install
```

### 3) Configure environment variables
Create a `.env` file in the project root and add required keys (example names):

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4) Run development server
```bash
npm run dev
```

### 5) Build for production
```bash
npm run build
npm run start
```

> **Note:** Exact script names may vary depending on your `package.json`.

---

## Project Metadata

- **Institution:** National University of Computer & Emerging Sciences (FAST-NU), Karachi
- **Project Type:** Academic Group Project — Full-Stack AI Healthcare Application
- **AI Model:** Gemini 1.5 Flash
- **Release:** v1.0 (Initial)
- **Date:** May 2026

---

## Future Roadmap

- Geolocation-based nearest donor/pharmacy matching
- FCM emergency push notifications for donor alerting
- In-app telemedicine consultations (WebRTC)
- Ambulance dispatch integrations
- HL7 FHIR-compatible health data interoperability
- Regional epidemiology tuning for AI triage quality

---

## Vision

SehatYaab is designed as **healthcare coordination infrastructure**—not just an app.

By integrating emergency donor access, medicine transparency, and AI-assisted triage into one secure platform, it demonstrates how modern software can materially reduce preventable healthcare delays at scale.

---

## Disclaimer

SehatYaab provides **preliminary AI-guided health insights** and is **not a replacement for professional medical diagnosis or emergency care**. In critical situations, users should immediately contact licensed healthcare providers or emergency services.
