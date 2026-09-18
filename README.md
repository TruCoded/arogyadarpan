# ArogyaDarpan (आरोग्यदर्पण)

> **AI-Powered Pre-Consultation Clinical Intake & Care-Continuity Platform**
> *Your health story, ready before the consultation.*
>
> **Core Philosophy**: *AI prepares. AI explains. The doctor decides.*

---

## 🚀 Overview

**ArogyaDarpan** is a full-stack, demo-ready pre-consultation clinical intake platform built for **Smart India Hackathon (SIH)**. 

Instead of forcing doctors to spend the first 5–10 minutes of a consultation taking basic history and piecing together fragmented old records, ArogyaDarpan collects and structures patient history **before** the doctor steps into the room.

### Key Capabilities

1. **Multilingual Voice + Touch Intake**: Hindi, English, Punjabi supported. Uses browser Web Speech API with real-time breathing microphone feedback and live transcript.
2. **Adaptive Clinical Interview**: Deterministic question sequence with dynamic branching based on chief complaint.
3. **Red-Flag Clinical Rules Engine**: Rule-based safety layer (NO LLM for emergencies) that triggers real-time priority review signals (e.g. Chest pain + Breathlessness).
4. **Medical Document Scanning & OCR**: Prescription, lab report, and discharge summary extraction with confidence scoring (e.g., 96% confidence).
5. **Conflict Detection**: Automated detection of conflicts between patient answers and past records (e.g. "No known allergy" vs "Penicillin allergy documented in 2024").
6. **Patient Medical Timeline**: Animated vertical timeline unifying past diagnoses, procedures, lab trends, and current visit.
7. **Doctor-in-the-Loop Review**: Doctor dashboard with patient queue, 3-column detail view, source traceability, and **Confirm / Edit / Reject** audit logging.
8. **FHIR / ABDM Ready**: One-click generation of standardized FHIR-compatible health record bundles.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + custom CSS design tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Voice**: Web Speech API (`SpeechRecognition` wrapper)

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose (includes Demo Mode with zero setup)
- **File Upload**: Multer
- **Architecture**: Modular REST API with clean controller/route/service separation

---

## 📂 Project Structure

```text
arogyadarpan/
├── index.html                 # App entry point with Google Fonts
├── vite.config.js             # Vite config with React & Tailwind plugins
├── package.json               # Frontend dependencies
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Button.jsx         # Primary/Secondary/Ghost/Danger buttons
│   │   ├── Card.jsx           # Surface card with hover & selected states
│   │   ├── Badge.jsx          # Status & severity badges
│   │   ├── ProgressBar.jsx    # Step progress bar with animated checks
│   │   ├── VoiceRecorder.jsx  # Pulse animation & live transcript
│   │   ├── ConfidenceBadge.jsx# High/Medium/Low confidence indicators
│   │   ├── ClinicalSignalCard.jsx # Red-flag & conflict alert cards
│   │   ├── CompletenessTracker.jsx # Clinical history completeness (✓/⚠/○)
│   │   ├── VerificationButtons.jsx # Confirm / Edit / Reject buttons
│   │   ├── Timeline.jsx       # Vertical medical timeline
│   │   ├── LoadingState.jsx   # Shimmer & dot loaders
│   │   └── ConnectionStatus.js# Online/Offline status indicator
│   ├── data/
│   │   ├── questionBank.js    # Adaptive clinical questions & categories
│   │   ├── clinicalRules.js   # Deterministic red-flag rules
│   │   ├── demoPatients.js    # Complete golden demo data (Rahul, Simran, Aman)
│   │   └── translations.js    # Hindi, English, Punjabi UI text
│   ├── hooks/
│   │   ├── useVoiceInput.js   # Web Speech API hook
│   │   └── useInterview.js    # Adaptive interview state controller
│   ├── pages/
│   │   ├── LandingPage.jsx    # Hero, flow diagram, features
│   │   ├── DemoPage.jsx       # Quick demo router for SIH judges
│   │   ├── patient/           # Patient journey (8 screens)
│   │   │   ├── LanguageSelection.jsx
│   │   │   ├── ConsentScreen.jsx
│   │   │   ├── PatientIdentification.jsx
│   │   │   ├── InterviewScreen.jsx
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── DocumentReview.jsx
│   │   │   ├── ConfirmationScreen.jsx
│   │   │   └── CompletionScreen.jsx
│   │   └── doctor/            # Doctor dashboard (2 screens)
│   │       ├── DoctorDashboard.jsx
│   │       └── PatientDetail.jsx
│   ├── App.jsx                # Router setup
│   ├── main.jsx               # React DOM render
│   └── index.css              # Design tokens & CSS animations
└── backend/
    ├── server.js              # Express server entry point
    ├── config/
    │   └── demoData.js        # Seed demo patients & records
    ├── models/                # 7 Mongoose schemas
    │   ├── Patient.js
    │   ├── Consultation.js
    │   ├── InterviewResponse.js
    │   ├── MedicalDocument.js
    │   ├── TimelineEvent.js
    │   ├── ClinicalSignal.js
    │   └── ClinicalSummary.js
    ├── routes/                # REST API endpoints
    │   ├── patientRoutes.js
    │   ├── consultationRoutes.js
    │   ├── interviewRoutes.js
    │   ├── documentRoutes.js
    │   ├── doctorRoutes.js
    │   └── summaryRoutes.js
    └── services/              # AI & Business wrappers
        ├── questionService.js
        ├── ocrService.js
        ├── summaryService.js
        └── abdmService.js
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Run Frontend
```bash
# Navigate to project root
cd arogyadarpan

# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run Backend (Optional — Frontend runs in Demo Mode out of the box)
```bash
# Navigate to backend directory
cd backend

# Start backend server
npm start
```
The server will start on [http://localhost:5000](http://localhost:5000).

---

## 🎯 Golden Path Demo (for SIH Judges)

To present the ideal workflow in under 3 minutes:

1. Click **"Try Demo"** on the landing page or visit `/demo`.
2. Click **"Start Golden Path Demo"**.
3. **Language**: Select **English** or **Hindi**.
4. **Consent**: Click **"Read aloud"** (uses TTS), check agreement, click **Continue**.
5. **Patient**: Click **"Continue as Demo Patient (Rahul Sharma)"**.
6. **Interview**:
   - See **History completeness: 72%** on the left.
   - Click the **Microphone** to test live voice input, or tap option buttons.
   - Select **Chest pain** → onset **2-3 days** → severity **7/10** → radiation **Left arm** → breathlessness **Yes**.
   - Notice the **Priority Clinical Review Required** signal trigger instantly!
7. **Documents**: See sample prescription and lab report uploaded with confidence scores (e.g. Metformin 96%, HbA1c 94%).
8. **Timeline**: Review the unified medical timeline (2024 to present).
9. **Confirmation**: Notice the **Allergy Conflict** warning (Patient said "No allergy", but 2024 record shows "Penicillin allergy"). Click **Confirm & Finish**.
10. **Doctor Dashboard**:
    - Log in as **Dr. Sharma**.
    - See **Rahul Sharma** flagged at the top with a **🔴 Priority** badge.
    - Click patient to inspect the 3-column clinical detail view.
    - Click **Confirm / Edit / Reject** on any section.
    - Click **"Export to ABDM"** to generate the FHIR JSON bundle.

---

## 🛡️ Clinical & Safety Principles

1. **AI prepares. AI explains. The doctor decides.**
2. **Never convert missing information into negative information**: If family history was not asked, it displays as `"Unknown — not yet confirmed"` or `"Not available"`, never `"No family history"`.
3. **Deterministic Red Flags**: Emergency alerts use rule-based thresholds, not probabilistic LLM text generation.
4. **Source Traceability**: Every extracted medication and diagnosis points directly back to its original document or voice response.

---

## 📄 License & Credits

Built for **Smart India Hackathon (SIH) 2026** by the student development team.
