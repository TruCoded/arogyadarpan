# ArogyaDarpan (आरोग्यदर्पण)

> **AI-Powered Multilingual Pre-Consultation Clinical Intake, Prescription OCR & Doctor Decision-Support Platform**
> 
> *Your complete clinical story, structured before the consultation begins.*
> 
> **Core Clinical Philosophy**: *AI prepares. AI explains. The doctor decides.*

---

## 🌟 Overview

**ArogyaDarpan** is an advanced, production-ready pre-consultation clinical intake and physician decision-support platform designed for **Smart India Hackathon (SIH)**.

In overcrowded outpatient departments (OPDs) and rural primary health centers (PHCs), doctors spend 5–10 minutes of every consultation transcribing basic patient complaints and deciphering paper prescriptions. ArogyaDarpan eliminates this administrative bottleneck by collecting, validating, and structuring patient history **before** the patient steps into the consultation room — through voice, touch, and intelligent prescription OCR — and delivering a synthesized, triaged clinical summary to the doctor's decision station.

---

## 🛠️ Complete Technology Stack

| Category | Technology | Version / Specification | Purpose |
|---|---|---|---|
| **Core Framework** | **React** | `v19.1.0` | Modern reactive component architecture |
| **Build Tool** | **Vite** | `v6.2.0` | Ultra-fast HMR and optimized production bundle compilation |
| **Routing** | **React Router DOM** | `v7.18.3` | Client-side routing with nested patient/doctor layouts |
| **Styling & Design System** | **Tailwind CSS** | `v4.3.3` | Utility-first CSS with custom clinical HSL tokens & glassmorphism |
| **Motion & Micro-interactions** | **Framer Motion** | `v13.1.1` | Fluid layout transitions, organ pulse animations, modal physics |
| **Iconography** | **Lucide React** | `v1.39.0` | Consistent, accessible clinical and navigational SVG icons |
| **Voice & Speech Recognition** | **Web Speech API & Bhashini/AI4Bharat** | Indic Conformer ASR Pipeline | Multilingual voice input with acoustic level visualizer |
| **Audio Text-to-Speech (TTS)** | **Universal Web Speech Synthesis** | Multi-accent BCP-47 Speech Engine | Voice narration for consent, questions, and option cards across all 10 languages |
| **Client-Side OCR** | **Tesseract.js** | `v7.0.0` | Offline-capable OCR for prescriptions, lab reports, and discharge summaries |
| **Clinical NLP & Parsing** | **Custom Hybrid Engine** | Regex Tokenizer + Medical Lexicon | Handwriting decryption, dosage abbreviation parsing (`OD`, `BD`, `TDS`, `SOS`), entity normalization |
| **Clinical Safety Engine** | **Deterministic Rules Engine** | ESI (Emergency Severity Index) Triage | Zero-hallucination deterministic red-flag & drug conflict detection |
| **Clinical Standards** | **HL7 FHIR R4 & ABDM** | Ayushman Bharat Digital Mission (M1/M2/M3) | Standardized clinical bundle export (`Composition`, `Condition`, `MedicationStatement`, etc.) |
| **Mobile Hybrid Container** | **Capacitor** | `v7.0.1` (`@capacitor/android`, `@capacitor/camera`) | Android native APK packaging and hardware camera integration |

---

## 📂 Detailed Project File Structure

```text
ArogyaDarpan_Clean_Multilingual_UI/
├── index.html                                 # HTML5 entry point with Inter/Outfit font loaders
├── vite.config.js                             # Vite configuration with React & Tailwind plugins
├── package.json                               # Dependencies, Capacitor scripts & metadata
├── capacitor.config.json                      # Capacitor mobile configuration
│
└── src/
    ├── main.jsx                               # Application bootstrap & DOM root render
    ├── App.jsx                                # Master route registry (Patient, Doctor, Kiosk, Demo)
    ├── index.css                              # Design tokens, medical blue palette, HSL variables
    │
    ├── assets/                                # Static branding, logo emblems & organ graphics
    │   ├── arogyadarpan_logo_emblem.png
    │   └── organ-heart.png
    │
    ├── components/                            # Reusable UI & Clinical Components
    │   ├── ArogyaDarpanLogo.jsx               # SVG branding logo
    │   ├── AudioControlsBar.jsx               # TTS volume, rate, and speech controls
    │   ├── AYUSHModeToggle.jsx                # Switch between Allopathic & AYUSH clinical tracks
    │   ├── Badge.jsx                          # Severity, confidence, and triage indicator pills
    │   ├── Button.jsx                         # Standardized accessible button component
    │   ├── CameraCaptureModal.jsx             # Camera stream modal for prescription scanning
    │   ├── Card.jsx                           # Glassmorphic card surface
    │   ├── ClinicalHistoryFormView.jsx        # Full-page single form view for clinical intake
    │   ├── ClinicalSignalCard.jsx             # Red-flag alert and discrepancy callout cards
    │   ├── CompletenessTracker.jsx            # SOCRATES history completeness score meter
    │   ├── ConfidenceBadge.jsx                # OCR entity extraction confidence visualizer
    │   ├── ConnectionStatus.jsx               # Online/offline network resilience banner
    │   ├── ConversationalVoiceModal.jsx       # Free-form natural voice conversational intake
    │   ├── DifferentialDiagnosisWidget.jsx    # ICD-10 diagnostic candidates & test suggestions
    │   ├── DocumentInspectorModal.jsx         # Deep-dive OCR entity inspector & raw text viewer
    │   ├── DrugSafetyBanner.jsx               # Real-time Drug-Drug & Drug-Allergy interaction alerts
    │   ├── EvidenceDrawer.jsx                 # Source provenance drawer linking insights to scans
    │   ├── KioskView.jsx                      # OPD Kiosk touch interface with organ telemetry
    │   ├── LanguageSelector.jsx               # Header dropdown with dual native & English labels
    │   ├── LoadingState.jsx                   # Shimmer loaders & clinical skeleton screens
    │   ├── ProgressBar.jsx                    # Step-by-step patient journey progress bar
    │   ├── RedFlagAlertModal.jsx              # Modal trigger for life-threatening acute symptoms
    │   ├── ScannerModal.jsx                   # Document capture, cropping, and OCR trigger modal
    │   ├── SessionTimeoutModal.jsx            # Kiosk idle security timeout modal
    │   ├── StitchAppHeader.jsx                # Top bar with back navigation and language picker
    │   ├── SymptomRadarCard.jsx               # Multi-axial symptom intensity radar
    │   ├── Timeline.jsx                       # Longitudinal patient health event timeline
    │   ├── TouchDatePicker.jsx                # Touch-friendly date selection for kiosks
    │   ├── TouchNumericKeypad.jsx             # On-screen numeric keypad for mobile/age entry
    │   ├── VerificationButtons.jsx            # Doctor Confirm / Edit / Reject action buttons
    │   ├── VoiceRecorder.jsx                  # Voice recording button with live audio level meter
    │   │
    │   └── kiosk/                             # Kiosk Specific Components
    │       ├── BionicAuthModal.jsx            # ABHA biometric / OTP verification modal
    │       ├── BionicKioskShell.jsx           # Fullscreen kiosk frame with telemetry bar
    │       └── Telemetry.jsx                  # Live simulated ECG / PPG pulse visualizers
    │
    ├── context/                               # Global State & Context Providers
    │   └── LanguageContext.jsx                # 10-language state, persistence & `t()` helper
    │
    ├── data/                                  # Knowledge Banks & Translations Matrix
    │   ├── bionicData.js                      # Organ telemetry mappings & symptom associations
    │   ├── clinicalRules.js                   # Deterministic ESI triage rules & allergy triggers
    │   ├── demoPatients.js                    # Pre-loaded clinical personas (Rahul, Simran, Aman)
    │   ├── questionBank.js                    # Adaptive SOCRATES & AYUSH Dashavidha questions
    │   ├── optionTranslations.js              # Complete 10-language options dictionary
    │   ├── coreUiTranslations.js              # Header, navigation, and common UI strings
    │   ├── journeyTranslations.js             # Patient intake journey translation matrix
    │   ├── supplementalTranslations.js        # Doctor station, triage, and timeline translations
    │   └── translations.js                    # Unified 10-language master dictionary
    │
    ├── hooks/                                 # Custom React Hooks
    │   ├── useInterview.js                    # Adaptive question branching & response state
    │   ├── useSessionTimeout.js               # Auto-reset timeout hook for public kiosks
    │   └── useVoiceInput.js                   # Unified Web Speech / Bhashini microphone hook
    │
    ├── services/                              # Core Clinical & AI Engines
    │   ├── abdmService.js                     # ABDM FHIR R4 clinical bundle generator
    │   ├── audioTtsService.js                 # Multi-language browser text-to-speech engine
    │   ├── bhashiniAsrService.js              # AI4Bharat / Bhashini Indic ASR client pipeline
    │   ├── clinicalNlpEngine.js               # Clinical entity normalization and symptom extraction
    │   ├── conversationalAiEngine.js          # Free-text conversational speech intake parser
    │   ├── differentialEngine.js              # Prioritized ICD-10 differential diagnosis matcher
    │   ├── documentIntelligenceEngine.js      # Advanced OCR classifier & Rx parser
    │   ├── drugInteractionEngine.js           # Real-time Drug-Drug & Drug-Allergy conflict engine
    │   ├── hpiEngine.js                       # History of Present Illness (HPI) structured builder
    │   ├── medicalParserService.js            # Prescription shorthand, dosage & frequency parser
    │   ├── ocrEngine.js                       # Tesseract OCR orchestrator & image pre-processing
    │   ├── redFlagRules.js                    # ESI emergency severity rules evaluator
    │   ├── reportInsightEngine.js             # Lab test value normalizer (Hb, Glucose, Lipid, etc.)
    │   ├── sessionStore.js                    # Local storage session manager for patient data
    │   ├── triageEngine.js                    # ESI triage priority assigner (Levels 1 to 5)
    │   └── voiceNormalizationEngine.js       # Voice input clean-up & symptom keyword mapper
    │
    └── pages/                                 # Application Screen Views
        ├── LandingPage.jsx                    # Hero section, workflow visualization & entry point
        ├── DemoPage.jsx                       # SIH Evaluator portal with instant patient presets
        │
        ├── patient/                           # Patient Pre-Consultation Intake Journey
        │   ├── SplashScreen.jsx               # Welcome screen & animated logo
        │   ├── LanguageSelection.jsx          # 10 Indic languages selection with voice preview
        │   ├── ConsentScreen.jsx              # DPDP Act 2023 & ABDM informed consent with audio
        │   ├── PatientIdentification.jsx      # Demographic intake & ABHA ID linking
        │   ├── InterviewScreen.jsx            # Adaptive SOCRATES & AYUSH voice intake
        │   ├── DocumentUpload.jsx             # Camera prescription capture & file upload
        │   ├── DocumentReview.jsx             # OCR extracted entity verification & editing
        │   ├── ConfirmationScreen.jsx         # Summary confirmation & conflict alert check
        │   ├── CompletionScreen.jsx           # Queue token generation & waiting room pass
        │   └── PatientDashboard.jsx           # Patient self-service clinical record view
        │
        └── doctor/                            # Doctor Decision Station
            ├── DoctorDashboard.jsx            # OPD live patient queue, triage metrics & filters
            └── PatientDetail.jsx              # 3-column clinical workstation with AI co-pilot
```

---

## 🌐 Full 10-Language Matrix

ArogyaDarpan delivers complete native-script localization across **10 official Indian languages** with **zero untranslated strings**:

| Language | Native Script | Code | Voice Input (STT) | Audio Readout (TTS) | Full UI Localization |
|---|---|:---:|:---:|:---:|:---:|
| **English** | English | `en` | ✅ | ✅ | ✅ |
| **Hindi** | हिन्दी | `hi` | ✅ | ✅ | ✅ |
| **Punjabi** | ਪੰਜਾਬੀ | `pa` | ✅ | ✅ | ✅ |
| **Bengali** | বাংলা | `bn` | ✅ | ✅ | ✅ |
| **Tamil** | தமிழ் | `ta` | ✅ | ✅ | ✅ |
| **Telugu** | తెలుగు | `te` | ✅ | ✅ | ✅ |
| **Marathi** | मराठी | `mr` | ✅ | ✅ | ✅ |
| **Gujarati** | ગુજરાતી | `gu` | ✅ | ✅ | ✅ |
| **Kannada** | ಕನ್ನಡ | `kn` | ✅ | ✅ | ✅ |
| **Malayalam** | മലയാളം | `ml` | ✅ | ✅ | ✅ |

---

## 🌿 Dual Clinical Intake Tracks

### 1. Allopathic Track (SOCRATES Framework)
- Systematically gathers: **S**ite, **O**nset, **C**haracter, **R**adiation, **A**ssociations, **T**iming, **E**xacerbating factors, and **S**everity (1–10).
- Triggers automatic Review of Systems (ROS), chronic condition tracking, and surgical history.

### 2. AYUSH Track (Dashavidha Pariksha — दशविध परीक्षा)
- **Prakriti** (Constitutional dosha assessment — Vata, Pitta, Kapha)
- **Vikriti** (Current morbidity & doshic imbalance state)
- **Sara** (Tissue vitality / Dhatu strength)
- **Samhanana** (Body compactness & build)
- **Pramana** (Anthropometric proportions)
- **Satmya** (Dietary adaptability & tolerance)
- **Sattva** (Mental resilience & temperament)
- **Ahara Shakti** (Digestive capacity & Agni state)
- **Vyayama Shakti** (Physical endurance & exercise capacity)
- **Vaya** (Age-adjusted chronological vitality stage)

---

## 📄 Prescription OCR & Document Intelligence

- **Handwriting & Prescription Tokenizer**: Deciphers doctor handwriting, dosage formulations (Tablets, Capsules, Syrups, Injections), strengths (`mg`, `mcg`, `ml`), and frequencies (`OD`, `BD`, `TDS`, `QID`, `SOS`, `HS`, `1-0-1`).
- **Strict Non-Medical Document Filter**: Rejects invalid images (memes, selfies, landscapes) with informative feedback.
- **Surgical Contradiction Validation**: Detects contradictory statements between patient input and scanned documents.
- **Offline Resilience**: Runs client-side Tesseract.js to maintain functionality even during internet loss in remote PHCs.

---

## 🩺 Doctor Decision Station & Co-Pilot

- **Differential Diagnosis Widget**: Generates prioritized diagnostic candidates mapped to **ICD-10 codes** with confidence percentages and suggested laboratory workups.
- **Drug Safety & Conflict Banner**: Detects dangerous Drug-Drug interactions and cross-allergies (e.g. Penicillin cross-reactivity with Cephalosporins).
- **Physician Verification Audit Trail**: Every AI-extracted symptom or prescription finding has an interactive **Confirm**, **Edit**, or **Reject** action, guaranteeing a licensed doctor remains in control.
- **ABDM FHIR R4 Bundle Export**: 1-click export of standardized Ayushman Bharat Digital Mission (ABDM) JSON bundles.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/TruCoded/arogyadarpan.git

# 2. Navigate to project root
cd arogyadarpan

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

### Production Build & Preview
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 👥 Authors & Acknowledgements

Built with ❤️ for **Smart India Hackathon (SIH) 2026** by team **TruCoded**.

- **GitHub Repository**: [TruCoded/arogyadarpan](https://github.com/TruCoded/arogyadarpan)
- **SIH Mirror**: [TruCoded/arogyadarpansih](https://github.com/TruCoded/arogyadarpansih)
- **Live Deployment**: [arogyadarpan-xi.vercel.app](https://arogyadarpan-xi.vercel.app)
