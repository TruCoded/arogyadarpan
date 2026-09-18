import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Heart, User, Calendar, Phone, FileText,
  ClipboardList, Clock, Pill, FlaskConical, AlertTriangle,
  Users, Cigarette, Wine, Download, ExternalLink, Check, X,
  Activity, Eye, Sparkles, Code, Leaf, Shield, Brain,
  Edit3, Stethoscope, Plus
} from 'lucide-react'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import ConfidenceBadge from '../../components/ConfidenceBadge'
import ClinicalSignalCard from '../../components/ClinicalSignalCard'
import VerificationButtons from '../../components/VerificationButtons'
import Timeline from '../../components/Timeline'
import EvidenceDrawer from '../../components/EvidenceDrawer'
import DocumentInspectorModal from '../../components/DocumentInspectorModal'
import DrugSafetyBanner from '../../components/DrugSafetyBanner'
import DifferentialDiagnosisWidget from '../../components/DifferentialDiagnosisWidget'
import { getDemoPatient } from '../../data/demoPatients'
import { prepareFHIRBundle } from '../../services/abdmService'
import { generateDifferentialDiagnosis } from '../../services/differentialEngine'

const tabs = [
  { id: 'summary', label: 'Structured Summary', icon: ClipboardList },
  { id: 'ayush', label: 'Dashavidha Pariksha', icon: Leaf },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'documents', label: 'OCR Records', icon: FileText },
  { id: 'interview', label: 'Intake Transcript', icon: Users },
]

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('summary')
  const [sectionStatuses, setSectionStatuses] = useState({})
  const [acceptedICD, setAcceptedICD] = useState(null)

  // Evidence Drawer & Document Inspector Modal states
  const [activeEvidence, setActiveEvidence] = useState(null)
  const [activeInspectorDoc, setActiveInspectorDoc] = useState(null)
  const [fhirModalOpen, setFhirModalOpen] = useState(false)

  const patient = getDemoPatient(id) || getDemoPatient('demo-001')
  const { summary, clinicalSignals, timeline, documents, interviewResponses = [] } = patient

  // Editable Summary State for Doctor Corrections
  const [summaryData, setSummaryData] = useState(summary)
  const [editModal, setEditModal] = useState({
    isOpen: false,
    sectionKey: '',
    title: '',
    textValue: ''
  })

  // Physician Clinical Notes & Orders State
  const [physicianOrders, setPhysicianOrders] = useState({
    diagnosis: '',
    clinicalNotes: '',
    medications: [
      { name: 'Tab Aspirin 75 mg', instructions: 'Once daily after breakfast', duration: '30 days' },
      { name: 'Tab Atorvastatin 20 mg', instructions: 'Once daily at bedtime', duration: '30 days' },
    ],
    labOrders: ['12-Lead ECG (STAT)', 'Serum Troponin-I', 'Lipid Profile', 'HbA1c'],
    isSigned: false,
    signedAt: null,
  })
  
  // Dynamic HL7 FHIR Bundle generated from active patient object
  const fhirBundle = useMemo(() => prepareFHIRBundle(patient), [patient])

  // AI Differential Diagnoses Generator
  const differentials = useMemo(() => generateDifferentialDiagnosis(patient), [patient])

  const handleVerify = (section) => {
    setSectionStatuses(prev => ({ ...prev, [section]: 'doctor_confirmed' }))
  }
  const handleReject = (section) => {
    setSectionStatuses(prev => ({ ...prev, [section]: 'rejected' }))
  }

  const handleOpenEdit = (sectionKey, title, currentVal) => {
    let initialText = ''
    if (typeof currentVal === 'string') {
      initialText = currentVal
    } else if (Array.isArray(currentVal)) {
      initialText = currentVal.map(item => typeof item === 'object' ? (item.name || item.condition || JSON.stringify(item)) : String(item)).join('\n')
    } else if (currentVal && typeof currentVal === 'object') {
      initialText = JSON.stringify(currentVal, null, 2)
    }
    setEditModal({
      isOpen: true,
      sectionKey,
      title,
      textValue: initialText
    })
  }

  const handleSaveCorrection = () => {
    const { sectionKey, textValue } = editModal
    setSummaryData(prev => ({
      ...prev,
      [sectionKey]: textValue
    }))
    setSectionStatuses(prev => ({
      ...prev,
      [sectionKey]: 'doctor_corrected'
    }))
    setEditModal({ isOpen: false, sectionKey: '', title: '', textValue: '' })
  }

  const handleUpdateMed = (index, field, val) => {
    setPhysicianOrders(prev => {
      const updated = [...prev.medications]
      updated[index] = { ...updated[index], [field]: val }
      return { ...prev, medications: updated }
    })
  }

  const handleAddPrescriptionItem = () => {
    setPhysicianOrders(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: 'New Medicine', instructions: 'Once daily', duration: '14 days' }
      ]
    }))
  }

  const handleRemoveMed = (index) => {
    setPhysicianOrders(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const handleAddLab = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault()
      const newTest = e.target.value.trim()
      setPhysicianOrders(prev => ({
        ...prev,
        labOrders: [...prev.labOrders, newTest]
      }))
      e.target.value = ''
    }
  }

  const handleRemoveLab = (index) => {
    setPhysicianOrders(prev => ({
      ...prev,
      labOrders: prev.labOrders.filter((_, i) => i !== index)
    }))
  }

  const handleSignConsultation = () => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setPhysicianOrders(prev => ({
      ...prev,
      isSigned: true,
      signedAt: now
    }))
  }

  const openEvidence = (title, snippet, documentName, type = 'document') => {
    setActiveEvidence({
      title,
      snippet,
      documentName,
      type,
      confidence: 0.96,
      source: documentName || 'Patient Voice Response',
      timestamp: '12 May 2025',
    })
  }

  // Derive SOCRATES framework breakdown dynamically from interview responses if available
  const socrates = useMemo(() => {
    const findVal = (qId) => {
      const resp = interviewResponses.find(r => r.questionId === qId)
      if (!resp) return null
      return Array.isArray(resp.structuredValue) ? resp.structuredValue.join(', ') : resp.structuredValue || resp.originalResponse
    }

    return {
      site: findVal('socrates_site') || findVal('sp_site') || 'Substernal / Center of chest',
      onset: findVal('socrates_onset') || findVal('f_onset') || findVal('sp_onset') || '3 days ago (Sudden onset)',
      character: findVal('socrates_character') || findVal('sp_character') || 'Heavy squeezing pressure (Dull pressure)',
      radiation: findVal('socrates_radiation') || 'Radiates to left arm and shoulder',
      associations: findVal('socrates_associations') || findVal('f_associations') || 'Breathlessness, sweating',
      timecourse: findVal('socrates_timecourse') || 'Episodic, triggered by walking',
      exacerbating: findVal('socrates_exacerbating') || findVal('sp_meal_relation') || 'Worse with exertion; better with rest',
      severity: (findVal('socrates_severity') || findVal('f_severity') || findVal('sp_severity') || '7') + ' / 10',
    }
  }, [interviewResponses])

  const dashavidha = {
    prakriti: 'Vata-Pitta Dvandvaja',
    vikriti: 'Vata-Pitta Vriddhi (Ruksha & Ushna vitiation)',
    sara: 'Rakta & Mamsa Sara',
    samhanana: 'Madhyama Samhanana (Moderate Build)',
    satmya: 'Madhyama Satmya',
    sattva: 'Madhyama Sattva',
    aharaShakti: 'Visham Agni (Irregular Appetite & Digestion)',
    vyayamaShakti: 'Avara Vyayama Shakti (Low Physical Endurance)',
    vaya: `${patient.age || '46'} years (Madhyama Vaya)`,
    koshtha: 'Krura Koshtha (Prone to constipation)',
  }

  const activeMeds = summary.medications ? summary.medications.map(m => m.name) : ['Metformin 500 mg', 'Amoxicillin']
  const activeAllergies = summary.allergies ? (summary.allergies.historicalRecord ? [summary.allergies.historicalRecord] : ['Penicillin']) : []

  return (
    <div className="min-h-screen kiosk-canvas text-slate-900 pb-16 pb-safe select-none">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 shadow-xs pt-safe">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/doctor')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3eHJKlVlUerGVveGjWkAx0cFSCFro69yrIgqK3eka9ng6vqBFVGwgS2A1JBO0Lkr1B0YbrOAAqvpUol5ZixVmusIi8jYTSaQiV7PMb6CxrfSD-IXp-euifp5q0XRj-wTGxgLPdrcblNl08nnijat-BbHaH3XgsPx0yCKVhGM61cCDKXumY2fD-oQOhvcj5VgkwBSyiovAsy0-8W-nsfxyd2QqLNcETBIQ-JauQLnM_nekVmrRDp-J"
                alt="ArogyaDarpan Logo"
                className="h-7 w-auto object-contain"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-slate-900 text-base">ArogyaDarpan</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006947] font-mono text-[10px] font-bold border border-emerald-200/60">
                    Clinical Decision Station
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Dr. Ananya Sharma • OPD Room 204</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFhirModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <Code className="size-3.5 text-teal-700" />
              <span className="hidden sm:inline">FHIR Bundle JSON</span>
            </button>
            <button
              onClick={() => setFhirModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-heading font-bold shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <Download className="size-3.5" />
              <span>Export ABDM</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column — Patient Vitals & Triage Signals */}
          <div className="w-full lg:col-span-4 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Stitch Screen 14 Patient Profile & Critical Alert Context Card */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

                {/* Demographics Main Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-slate-100"
                        alt={patient.name}
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjh8_SbNrrj7vsSdr0izshu6DgHanECLYgYVC745-J1gdhfCDIwtFMEjR5FT0cJGzqVSyvXQyJHXs87YGWPGvKKoR1wFc7tTZRT4pfZ8OaHcAU9MQZChLoySy5X198becf5PBxIFPQhR6lDKPHB5tf8RwfhH2fod7wntVf6O2MkHr1fpx7Ypsj2Xxdt96jqU8F-pG6MJq1GIgQlwn0zopNo4rDbpdS5ZQ3yzBjO5e6yrbGjFu5lHWc"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00855b] ring-2 ring-white" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h1 className="font-heading font-bold text-base text-slate-900 tracking-tight">
                          {patient.name}
                        </h1>
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {patient.age || '32'}{patient.gender ? patient.gender[0] : 'M'}
                        </span>
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#006947] border border-emerald-200/60">
                          B+
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-teal-700">badge</span>
                        <span>ABHA: {patient.abhaId || '91-8842-1920-4491'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-mono text-[10px] font-bold px-2 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">meeting_room</span>
                      OPD 204
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 mt-1">{patient.phone || '+91 98765-43210'}</span>
                  </div>
                </div>

                {/* Critical Diagnostic Flags Banner */}
                <div className="rounded-xl bg-red-50 border border-red-200/80 p-3 flex flex-col gap-1.5 text-red-700 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-red-600 animate-pulse">emergency</span>
                    <span className="font-heading font-bold text-xs text-red-800 tracking-tight">
                      Critical Diagnostic Flags
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 pl-5 text-[11px]">
                    <p className="font-medium text-slate-800">
                      <span className="text-red-600 font-bold">Red Flag:</span> Acute retrosternal chest pain with left arm radiation.
                    </p>
                    <p className="font-medium text-slate-800">
                      <span className="text-amber-600 font-bold">Conflict:</span> Penicillin allergy discrepancy between OCR (Allergic) & Voice Intake (None reported).
                    </p>
                  </div>
                </div>
              </div>

              {/* Drug Safety & Contraindication Matrix */}
              <DrugSafetyBanner medications={activeMeds} allergies={activeAllergies} />

              {/* Triage Signals */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Clinical Priority Signals ({clinicalSignals.length})
                  </h3>
                  <span className="text-[10px] text-primary-600 font-semibold">Rules Engine</span>
                </div>

                {clinicalSignals.map((signal, i) => (
                  <ClinicalSignalCard
                    key={i}
                    severity={signal.severity}
                    message={signal.message}
                    detail={signal.detail}
                    disclaimer={signal.type === 'red_flag' ? signal.disclaimer || 'This is an alert for healthcare staff. It is not a diagnosis.' : undefined}
                    currentValue={signal.currentValue}
                    previousValue={signal.previousValue}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column — Tabbed Clinical View */}
          <div className="w-full lg:col-span-8 space-y-6">
            {/* AI Differential Diagnosis Widget */}
            <DifferentialDiagnosisWidget
              candidates={differentials}
              onSelectICD={(cand) => setAcceptedICD(cand)}
            />

            {acceptedICD && (
              <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 flex items-center justify-between text-xs text-emerald-900">
                <span className="font-bold">✓ Doctor Accepted Diagnosis: ICD {acceptedICD.icdCode} — {acceptedICD.disease}</span>
                <Badge severity="success" size="sm">EHR Populated</Badge>
              </div>
            )}

            {/* Tab Nav */}
            <div className="flex items-center gap-1.5 bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-xs overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-heading whitespace-nowrap
                    transition-all cursor-pointer
                    ${activeTab === tab.id
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }
                  `}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* STRUCTURED SUMMARY TAB (Exact SIH Sequence) */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <Card padding="px-6 py-4" className="flex items-center justify-between border-l-4 border-l-primary-500">
                    <div>
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">SIH Compliant History Format</span>
                      <h3 className="font-bold text-text-primary text-base font-heading">
                        Pre-Consultation Clinical Intake Draft
                      </h3>
                    </div>
                    <Badge severity="success" dot size="md">
                      Draft Ready for Physician Verification
                    </Badge>
                  </Card>

                  {/* 1. Chief Complaint */}
                  <SummarySection
                    title="1. Chief Complaint"
                    content={summaryData.chiefComplaint}
                    source="Patient ASR / Touch Intake"
                    status={sectionStatuses.chiefComplaint}
                    onConfirm={() => handleVerify('chiefComplaint')}
                    onEdit={() => handleOpenEdit('chiefComplaint', 'Chief Complaint', summaryData.chiefComplaint)}
                    onReject={() => handleReject('chiefComplaint')}
                    onViewSource={() => openEvidence('Chief Complaint', summaryData.chiefComplaint, 'Patient Voice Transcript', 'voice')}
                  />

                  {/* 2. HPI — SOCRATES Framework Breakdown */}
                  <Card>
                    <div className="flex items-center justify-between mb-3 border-b border-border-light pb-2">
                      <h3 className="font-bold text-text-primary font-heading text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-500" />
                        2. History of Present Illness (SOCRATES Framework)
                      </h3>
                      <VerificationButtons
                        status={sectionStatuses.hpi}
                        onConfirm={() => handleVerify('hpi')}
                        onEdit={() => handleOpenEdit('hpi', 'History of Present Illness (HPI)', summaryData.hpi)}
                        onReject={() => handleReject('hpi')}
                      />
                    </div>

                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">{summaryData.hpi}</p>

                    {/* SOCRATES Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-surface-muted p-3.5 rounded-xl border border-border-light">
                      <div><span className="font-bold text-text-primary">Site:</span> {socrates.site}</div>
                      <div><span className="font-bold text-text-primary">Onset:</span> {socrates.onset}</div>
                      <div><span className="font-bold text-text-primary">Character:</span> {socrates.character}</div>
                      <div><span className="font-bold text-text-primary">Radiation:</span> {socrates.radiation}</div>
                      <div><span className="font-bold text-text-primary">Associations:</span> {socrates.associations}</div>
                      <div><span className="font-bold text-text-primary">Time Course:</span> {socrates.timecourse}</div>
                      <div><span className="font-bold text-text-primary">Exacerbating:</span> {socrates.exacerbating}</div>
                      <div><span className="font-bold text-text-primary">Severity:</span> <span className="font-bold text-red-600">{socrates.severity}</span></div>
                    </div>
                  </Card>

                  {/* 3. Past Medical & Surgical History */}
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-text-primary font-heading text-base">3. Past Medical & Surgical History</h3>
                      <VerificationButtons
                        status={sectionStatuses.pastHistory}
                        onConfirm={() => handleVerify('pastHistory')}
                        onEdit={() => handleOpenEdit('pastHistory', 'Past Medical & Surgical History', summaryData.pastHistory)}
                        onReject={() => handleReject('pastHistory')}
                      />
                    </div>
                    {Array.isArray(summaryData.pastHistory) ? (
                      summaryData.pastHistory.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-surface-muted rounded-xl px-4 py-2.5 mb-2 text-sm">
                          <span className="font-bold text-text-primary">{item.condition} (Since {item.since})</span>
                          <button onClick={() => openEvidence(item.condition, `${item.condition} documented at District Hospital`, 'Discharge_Summary_2024.pdf', 'document')} className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                            <Eye className="w-3.5 h-3.5" /> Source Document
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-text-secondary">{String(summaryData.pastHistory)}</p>
                    )}
                  </Card>

                  {/* 4. Drug & Allergy History */}
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-text-primary font-heading text-base flex items-center gap-2">
                        <Pill className="w-4 h-4 text-primary-500" /> 4. Drug & Allergy History
                      </h3>
                      <VerificationButtons
                        status={sectionStatuses.medications}
                        onConfirm={() => handleVerify('medications')}
                        onEdit={() => handleOpenEdit('medications', 'Drug & Allergy History', summaryData.medications)}
                        onReject={() => handleReject('medications')}
                      />
                    </div>

                    <div className="space-y-2 mb-3">
                      {Array.isArray(summaryData.medications) ? (
                        summaryData.medications.map((med, i) => (
                          <div key={i} className="flex items-center justify-between bg-surface-muted rounded-xl px-4 py-2.5 text-sm">
                            <div>
                              <span className="font-bold text-text-primary">{med.name}</span>
                              <span className="text-xs text-text-muted ml-2">{med.frequency}</span>
                            </div>
                            <ConfidenceBadge score={med.confidence || 0.96} />
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-text-secondary">{String(summaryData.medications)}</p>
                      )}
                    </div>

                    {summaryData.allergies?.status === 'conflict' && (
                      <ClinicalSignalCard
                        severity="high"
                        message="Allergy Information Conflict"
                        currentValue={summaryData.allergies.currentResponse}
                        previousValue={summaryData.allergies.historicalRecord}
                      />
                    )}
                  </Card>

                  {/* 5. Family History */}
                  <SummarySection
                    title="5. Family History"
                    content={summaryData.familyHistory || 'Father had coronary artery disease at age 52'}
                    status={sectionStatuses.familyHistory}
                    onConfirm={() => handleVerify('familyHistory')}
                    onEdit={() => handleOpenEdit('familyHistory', 'Family History', summaryData.familyHistory || 'Father had coronary artery disease at age 52')}
                    onReject={() => handleReject('familyHistory')}
                  />

                  {/* 6. Personal & Lifestyle History (Ahara-Vihara) */}
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-text-primary font-heading text-base">6. Personal & Lifestyle History (Ahara-Vihara)</h3>
                      <VerificationButtons
                        status={sectionStatuses.personalHistory}
                        onConfirm={() => handleVerify('personalHistory')}
                        onEdit={() => handleOpenEdit('personalHistory', 'Personal & Lifestyle History', summaryData.personalHistory || 'Smoking: Quit 2 years ago (Ex-smoker), Alcohol: Occasional, Diet: Mixed, Physical Activity: Moderate')}
                        onReject={() => handleReject('personalHistory')}
                      />
                    </div>
                    {typeof summaryData.personalHistory === 'string' ? (
                      <p className="text-sm text-text-secondary leading-relaxed">{summaryData.personalHistory}</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 text-xs bg-surface-muted p-3.5 rounded-xl">
                        <div><span className="font-bold text-text-primary">Smoking:</span> Quit 2 years ago (Ex-smoker)</div>
                        <div><span className="font-bold text-text-primary">Alcohol:</span> Occasional social use</div>
                        <div><span className="font-bold text-text-primary">Ahara (Diet):</span> Mixed diet, irregular meal timings</div>
                        <div><span className="font-bold text-text-primary">Vihara (Lifestyle):</span> Moderate physical activity, desk work</div>
                      </div>
                    )}
                  </Card>

                  {/* 7. Review of Systems (ROS) */}
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-text-primary font-heading text-base">7. Review of Systems (ROS)</h3>
                      <VerificationButtons
                        status={sectionStatuses.ros}
                        onConfirm={() => handleVerify('ros')}
                        onEdit={() => handleOpenEdit('ros', 'Review of Systems (ROS)', summaryData.ros || 'Cardiovascular: Chest pain, exertional dyspnea, diaphoresis. Respiratory: Shortness of breath on exertion.')}
                        onReject={() => handleReject('ros')}
                      />
                    </div>
                    {typeof summaryData.ros === 'string' ? (
                      <p className="text-sm text-text-secondary leading-relaxed">{summaryData.ros}</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        <div className="bg-surface-muted p-2.5 rounded-lg flex justify-between">
                          <span className="font-bold text-text-primary">Cardiovascular:</span>
                          <span className="text-text-secondary">Chest pain, exertional dyspnea, diaphoresis</span>
                        </div>
                        <div className="bg-surface-muted p-2.5 rounded-lg flex justify-between">
                          <span className="font-bold text-text-primary">Respiratory:</span>
                          <span className="text-text-secondary">Shortness of breath on exertion; no chronic cough</span>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* 8. Prior Investigations Summary */}
                  {summaryData.investigations?.length > 0 && (
                    <Card>
                      <h3 className="font-bold text-text-primary font-heading text-base flex items-center gap-2 mb-3">
                        <FlaskConical className="w-4 h-4 text-purple-500" /> 8. Prior Investigations Summary
                      </h3>
                      {summaryData.investigations.map((inv, i) => (
                        <div key={i} className="flex items-center justify-between bg-surface-muted rounded-xl px-4 py-2.5 mb-2 text-sm">
                          <div>
                            <span className="font-bold text-text-primary">{inv.name}: {inv.value}</span>
                            <span className="text-xs text-text-muted ml-2">({inv.date})</span>
                          </div>
                          <Badge severity={inv.status === 'abnormal' ? 'medium' : 'success'} size="sm">
                            {inv.status === 'abnormal' ? 'Abnormal' : 'Normal'}
                          </Badge>
                        </div>
                      ))}
                    </Card>
                  )}

                  {/* 9. Physician Clinical Notes, Orders & Rx Plan */}
                  <Card className="border-2 border-primary-300 shadow-md bg-gradient-to-br from-surface to-primary-50/20">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-light">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                          <Stethoscope className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary font-heading text-base">
                            Physician Clinical Notes, Orders & Prescription Plan
                          </h3>
                          <p className="text-xs text-text-muted">ABDM Practitioner Direct EHR Entry</p>
                        </div>
                      </div>
                      {physicianOrders.isSigned ? (
                        <Badge severity="success" size="md">
                          ✓ Signed at {physicianOrders.signedAt}
                        </Badge>
                      ) : (
                        <Badge severity="neutral" size="sm">
                          Draft (Unsigned)
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Final Clinical Diagnosis */}
                      <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">
                          Final Confirmed Diagnosis / Clinical Impression
                        </label>
                        <input
                          type="text"
                          value={physicianOrders.diagnosis}
                          onChange={(e) => setPhysicianOrders(prev => ({ ...prev, diagnosis: e.target.value }))}
                          placeholder={acceptedICD ? `ICD ${acceptedICD.icdCode} — ${acceptedICD.disease}` : "e.g. Unstable Angina (ICD-10 I20.0) / Acute Coronary Syndrome"}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-raised text-sm font-medium text-text-primary focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      {/* Rx Medications */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-primary-600" /> Prescribed Medications (Rx)
                          </label>
                          <button
                            type="button"
                            onClick={handleAddPrescriptionItem}
                            className="text-xs text-primary-600 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Drug
                          </button>
                        </div>
                        <div className="space-y-2">
                          {physicianOrders.medications.map((med, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-surface-raised p-2.5 rounded-xl border border-border-light text-xs">
                              <input
                                type="text"
                                value={med.name}
                                onChange={(e) => handleUpdateMed(idx, 'name', e.target.value)}
                                placeholder="Drug Name & Strength"
                                className="w-full sm:flex-1 font-bold text-text-primary bg-transparent focus:outline-none"
                              />
                              <input
                                type="text"
                                value={med.instructions}
                                onChange={(e) => handleUpdateMed(idx, 'instructions', e.target.value)}
                                placeholder="Dosage & Timing"
                                className="w-full sm:flex-1 text-text-secondary bg-transparent focus:outline-none"
                              />
                              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                                <input
                                  type="text"
                                  value={med.duration}
                                  onChange={(e) => handleUpdateMed(idx, 'duration', e.target.value)}
                                  placeholder="Duration"
                                  className="w-24 text-text-muted bg-transparent focus:outline-none text-left sm:text-right"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMed(idx)}
                                  className="text-text-muted hover:text-red-500 cursor-pointer p-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Diagnostic & Lab Orders */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                            <FlaskConical className="w-3.5 h-3.5 text-purple-600" /> Diagnostic & Lab Requisitions
                          </label>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {physicianOrders.labOrders.map((lab, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold">
                              {lab}
                              <button type="button" onClick={() => handleRemoveLab(idx)} className="cursor-pointer hover:text-red-600">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            onKeyDown={handleAddLab}
                            placeholder="+ Type order and press Enter"
                            className="text-xs px-3 py-1 rounded-lg border border-dashed border-border-light bg-surface-raised focus:outline-none focus:ring-1 focus:ring-primary-500 w-56"
                          />
                        </div>
                      </div>

                      {/* Clinical Notes & Follow-up */}
                      <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">
                          Physician Notes & Clinical Advice
                        </label>
                        <textarea
                          rows={3}
                          value={physicianOrders.clinicalNotes}
                          onChange={(e) => setPhysicianOrders(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                          placeholder="Admission in cardiac day care advised; urgent coronary angiography scheduled; lifestyle moderation..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-raised text-sm text-text-primary focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      {/* Sign and Finalize Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-border-light">
                        <span className="text-xs text-text-muted">
                          Directly links to ABDM Health Information Exchange (HIE-CM).
                        </span>
                        <Button
                          variant={physicianOrders.isSigned ? 'success' : 'primary'}
                          size="md"
                          icon={Check}
                          onClick={handleSignConsultation}
                        >
                          {physicianOrders.isSigned ? '✓ Signed & Finalized' : 'Sign & Complete Consultation'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* DASHAVIDHA PARIKSHA (AYUSH TAB) */}
              {activeTab === 'ayush' && (
                <Card>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-border-light">
                    <div className="flex items-center gap-2.5">
                      <Leaf className="w-6 h-6 text-emerald-600" />
                      <div>
                        <h3 className="font-bold text-text-primary text-lg font-heading">
                          Dashavidha Pariksha (10-Fold Ayurvedic Assessment)
                        </h3>
                        <p className="text-xs text-text-muted">AIIA / Ministry of Ayush Clinical Protocol</p>
                      </div>
                    </div>
                    <Badge severity="success" dot size="sm">AYUSH Validated</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl">
                      <span className="font-bold text-emerald-900 block mb-1">1. Prakriti (Constitution):</span>
                      <p className="text-emerald-800">{dashavidha.prakriti}</p>
                    </div>
                    <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl">
                      <span className="font-bold text-emerald-900 block mb-1">2. Vikriti (Current Imbalance):</span>
                      <p className="text-emerald-800">{dashavidha.vikriti}</p>
                    </div>
                    <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                      <span className="font-bold text-text-primary block mb-1">3. Sara (Tissue Excellence):</span>
                      <p className="text-text-secondary">{dashavidha.sara}</p>
                    </div>
                    <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                      <span className="font-bold text-text-primary block mb-1">4. Samhanana (Compactness):</span>
                      <p className="text-text-secondary">{dashavidha.samhanana}</p>
                    </div>
                    <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                      <span className="font-bold text-text-primary block mb-1">5. Satmya (Adaptability):</span>
                      <p className="text-text-secondary">{dashavidha.satmya}</p>
                    </div>
                    <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                      <span className="font-bold text-text-primary block mb-1">6. Sattva (Mental Endurance):</span>
                      <p className="text-text-secondary">{dashavidha.sattva}</p>
                    </div>
                    <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                      <span className="font-bold text-text-primary block mb-1">7. Ahara Shakti (Agni):</span>
                      <p className="text-text-secondary">{dashavidha.aharaShakti}</p>
                    </div>
                    <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                      <span className="font-bold text-text-primary block mb-1">8. Vyayama Shakti (Stamina):</span>
                      <p className="text-text-secondary">{dashavidha.vyayamaShakti}</p>
                    </div>
                    <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                      <span className="font-bold text-text-primary block mb-1">9. Vaya (Age Stage):</span>
                      <p className="text-text-secondary">{dashavidha.vaya}</p>
                    </div>
                    <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                      <span className="font-bold text-text-primary block mb-1">10. Koshtha (Bowel Habit):</span>
                      <p className="text-text-secondary">{dashavidha.koshtha}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* TIMELINE TAB */}
              {activeTab === 'timeline' && (
                <Card>
                  <h3 className="font-bold text-text-primary font-heading text-base mb-6">Unified Patient Medical Timeline</h3>
                  <Timeline events={timeline} />
                </Card>
              )}

              {/* OCR RECORDS TAB */}
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <Card key={doc.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-200">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-text-primary text-base font-heading">{doc.fileName}</h4>
                            <p className="text-xs text-text-muted">{doc.documentType} • {doc.documentDate}</p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => setActiveInspectorDoc(doc)}
                        >
                          Inspect Document & OCR Text
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* INTAKE TRANSCRIPT TAB */}
              {activeTab === 'interview' && (
                <div className="space-y-3">
                  {interviewResponses.map((resp, i) => (
                    <Card key={i} padding="px-5 py-4">
                      <p className="text-xs font-semibold text-text-muted mb-1">{resp.question}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-text-primary text-sm">
                            {Array.isArray(resp.structuredValue) ? resp.structuredValue.join(', ') : String(resp.structuredValue)}
                          </p>
                          {resp.originalResponse && (
                            <p className="text-xs text-text-muted italic mt-1">"{resp.originalResponse}"</p>
                          )}
                        </div>
                        <Badge severity="neutral" size="sm">
                          {resp.inputMethod === 'voice' ? '🎙️ Voice Input' : '👆 Touch Choice'}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Slide-over Evidence Drawer */}
      <EvidenceDrawer
        isOpen={Boolean(activeEvidence)}
        onClose={() => setActiveEvidence(null)}
        evidenceData={activeEvidence}
        onVerify={() => handleVerify('chiefComplaint')}
      />

      {/* Document Inspector Modal */}
      <DocumentInspectorModal
        isOpen={Boolean(activeInspectorDoc)}
        onClose={() => setActiveInspectorDoc(null)}
        documentData={activeInspectorDoc}
      />

      {/* FHIR Bundle JSON Viewer Modal */}
      {fhirModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface-raised rounded-3xl border border-border-light shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4 border-b border-border-light pb-3">
              <h3 className="font-bold text-text-primary text-base font-heading flex items-center gap-2">
                <Code className="w-5 h-5 text-primary-600" /> Standardized ABDM FHIR Bundle JSON (HL7 R4)
              </h3>
              <button onClick={() => setFhirModalOpen(false)} className="p-1 text-text-muted hover:text-text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="bg-gray-900 text-emerald-400 p-4 rounded-xl text-xs font-mono max-h-96 overflow-y-auto leading-relaxed">
              {JSON.stringify(fhirBundle, null, 2)}
            </pre>
            <div className="mt-4 flex justify-end">
              <Button size="md" onClick={() => setFhirModalOpen(false)}>
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Edit & Correction Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface-raised rounded-3xl border border-border-light shadow-2xl max-w-lg w-full p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4 border-b border-border-light pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-text-primary text-base font-heading">
                  Physician Correction: {editModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModal({ isOpen: false, sectionKey: '', title: '', textValue: '' })}
                className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-text-secondary">
                Clinical Finding / Correction (Physician Overrule):
              </label>
              <textarea
                rows={5}
                value={editModal.textValue}
                onChange={(e) => setEditModal(prev => ({ ...prev, textValue: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-muted text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 font-sans leading-relaxed"
                placeholder="Enter corrected clinical notes, ICD diagnosis or revised symptoms..."
              />
              <p className="text-[11px] text-text-muted">
                ℹ️ Your clinical overrule will be marked as "Corrected by Physician" in the ABDM EHR Bundle and signed with your Practitioner Registration Number.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditModal({ isOpen: false, sectionKey: '', title: '', textValue: '' })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                onClick={handleSaveCorrection}
              >
                Save & Verify Correction
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SummarySection({ title, content, source, status, onConfirm, onEdit, onReject, onViewSource }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-text-primary font-heading text-base">{title}</h3>
        <VerificationButtons status={status} onConfirm={onConfirm} onEdit={onEdit} onReject={onReject} />
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{content}</p>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-light text-xs">
        <span className="text-text-muted">Source: {source}</span>
        {onViewSource && (
          <button onClick={onViewSource} className="text-primary-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
            <Eye className="w-3.5 h-3.5" /> Inspect Evidence
          </button>
        )}
      </div>
    </Card>
  )
}
