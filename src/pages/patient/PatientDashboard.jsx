import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Calendar, Clock, ShieldCheck, FileText, CheckCircle2,
  AlertTriangle, ArrowRight, Eye, Trash2, Plus, Download,
  Activity, Pill, Heart, Scissors, Users, Stethoscope, RefreshCw,
  ExternalLink, FileCheck, Layers, Sparkles
} from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import LanguageSelector from '../../components/LanguageSelector'
import Timeline from '../../components/Timeline'
import DocumentInspectorModal from '../../components/DocumentInspectorModal'
import StitchAppHeader from '../../components/StitchAppHeader'
import { useLanguage } from '../../context/LanguageContext'
import {
  getActivePatient,
  getActiveDocuments,
  getActiveResponses,
  buildDynamicTimeline,
  clearPatientSession
} from '../../services/sessionStore'
import { generateHPI } from '../../services/hpiEngine'

export default function PatientDashboard() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [activeTab, setActiveTab] = useState('current') // 'current' | 'history' | 'documents' | 'records'
  const [activeInspectorDoc, setActiveInspectorDoc] = useState(null)
  const [docCategoryFilter, setDocCategoryFilter] = useState('all')

  const patient = useMemo(() => getActivePatient(), [])
  const documents = useMemo(() => getActiveDocuments(), [])
  const responses = useMemo(() => getActiveResponses(), [])
  const timelineEvents = useMemo(() => buildDynamicTimeline(), [])

  // Mock Previous Consultations
  const previousConsultations = [
    {
      id: 'cons-2025-05',
      date: '12 May 2025',
      department: 'Cardiology OPD',
      doctor: 'Dr. Alok Verma, MD (Cardiology)',
      chiefComplaint: 'Chest Heaviness on Exertion',
      diagnosis: 'Hypertensive Heart Disease / Mild Angina',
      status: 'Completed',
      notes: 'Advised lifestyle modification, low sodium diet. Prescribed Telmisartan 40mg and Rosuvastatin 10mg.',
      documentsCount: 2,
    },
    {
      id: 'cons-2024-11',
      date: '20 Nov 2024',
      department: 'Pulmonology OPD',
      doctor: 'Dr. Meenakshi Sundaram, MD (Chest)',
      chiefComplaint: 'Persistent Productive Cough with Wheezing',
      diagnosis: 'Acute Bronchitis with Bronchospasm',
      status: 'Completed',
      notes: 'Completed 5-day course of Azithromycin and Levolin inhaler. Chest clear on discharge.',
      documentsCount: 1,
    }
  ]

  // Filtered documents
  const filteredDocs = useMemo(() => {
    if (docCategoryFilter === 'all') return documents
    return documents.filter(d => (d.category || '').toLowerCase().includes(docCategoryFilter.toLowerCase()))
  }, [documents, docCategoryFilter])

  const chiefComplaintResp = responses.find(r => r.questionId === 'chief_complaint')
  const chiefComplaint = chiefComplaintResp?.structuredValue || chiefComplaintResp?.originalResponse || 'General Consultation'

  const generatedHPI = useMemo(() => {
    return generateHPI(responses, patient)
  }, [responses, patient])

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900 flex flex-col select-none pb-28 pb-safe">
      <StitchAppHeader title="स्वास्थ्य केंद्र (Patient Wellness Hub)" showBack onBack={() => navigate('/')} />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Stitch Upcoming Consultation Hero Card */}
        <div className="p-5 rounded-3xl bg-white border border-teal-500/20 shadow-xs backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI_vnaonz1_3Nzdgz6hH7_03cwDYwEEpn8cLmuZa2dxh3Jkp0OnCq5e7o5uB4JRzoWIQKylgRbAw_KLNFgpe9_mDpmSjJ2S_lWN7GJSU5JeVGai4MFaLdNKtIuvcmWh3mR_T1lNUxZr2E_YRz6A6U7gYMoB8TlhFSLDMoiM75Iiev51tQcz2lYsQrtc4gzki9DTUDp6XLhszNCJ05i59NiNzQuH5aV9eQC__mFxevP1t2XE3X09Arm"
                alt="Dr. Ananya Sharma"
                className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-2 ring-teal-500/20"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-bold text-base text-slate-900">Dr. Ananya Sharma</h3>
                <span className="text-teal-600 font-bold text-xs bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  MD, Cardiology
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Apex Health Center, Room 204 • Today, 11:30 AM</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Clock className="size-3" /> Token #A-14 (In Queue)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/patient/interview')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-heading font-bold text-xs shadow-teal-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="size-4" />
            <span>Continue Intake Interview</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* Stitch 2x2 Quick Action Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => navigate('/patient/interview')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <span className="text-xl">🎙️</span>
            </div>
            <p className="font-heading font-bold text-xs text-slate-900">Voice Intake</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Speak symptoms</p>
          </div>

          <div
            onClick={() => navigate('/patient/documents')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <span className="text-xl">📄</span>
            </div>
            <p className="font-heading font-bold text-xs text-slate-900">Upload Records</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Scan prescription</p>
          </div>

          <div
            onClick={() => setActiveTab('timeline')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <span className="text-xl">⏳</span>
            </div>
            <p className="font-heading font-bold text-xs text-slate-900">Medical Timeline</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Longitudinal view</p>
          </div>

          <div
            onClick={() => setActiveTab('records')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <span className="text-xl">💊</span>
            </div>
            <p className="font-heading font-bold text-xs text-slate-900">Current Meds</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Track prescriptions</p>
          </div>
        </div>

        {/* Patient Profile & ABHA / Consent Status Banner */}
        <Card className="p-6 bg-gradient-to-r from-primary-900 to-slate-900 text-white border-0 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
            <Heart className="w-64 h-64 text-white" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
                {(patient.name || 'User').split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold font-heading text-white">{patient.name || 'Patient'}</h1>
                  <span className="font-mono text-xs bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                    {patient.patientId || 'AD-2026-10492'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {patient.age || '46'} yrs • {patient.gender || 'Male'} • Blood Group: {patient.bloodGroup || 'B+'} • Phone: {patient.phone || '9876543210'}
                </p>
              </div>
            </div>

            {/* ABHA & DPDP Consent Status Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-left">
                <div className="flex items-center gap-1.5 text-xs text-teal-300 font-bold mb-0.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ABHA Linked</span>
                </div>
                <p className="font-mono text-xs text-white font-semibold">
                  {patient.abhaId || 'ABHA-1234-5678'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-left">
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold mb-0.5">
                  <FileCheck className="w-4 h-4" />
                  <span>DPDP Act 2023 Consent</span>
                </div>
                <p className="text-xs text-slate-200">
                  Active • Signed {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Dashboard Tabs */}
        <div className="flex gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
          {[
            { id: 'current', label: 'Current Consultation', icon: Stethoscope },
            { id: 'history', label: 'Previous Consultations', icon: Calendar },
            { id: 'documents', label: `Uploaded Records (${documents.length})`, icon: FileText },
            { id: 'records', label: 'Consolidated Medical History', icon: Activity },
            { id: 'timeline', label: 'Medical Timeline', icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white bg-white/60 border border-slate-200/60'
              }`}
            >
              <tab.icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: CURRENT CONSULTATION */}
        {activeTab === 'current' && (
          <div className="space-y-4">
            <Card className="border-l-4 border-l-primary-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-light mb-4 gap-3">
                <div>
                  <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">Active Visit Status</span>
                  <h3 className="text-lg font-bold text-text-primary font-heading">
                    OPD Consultation: {chiefComplaint.toUpperCase()}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Visit Date: {new Date().toLocaleDateString('en-IN')} • Token #{responses.length > 0 ? 'T-42' : 'T-Pending'}
                  </p>
                </div>

                <Badge severity="success" dot size="md">
                  Ready for Physician Review
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-xs">
                <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                  <span className="text-text-muted block mb-1">Queue Status:</span>
                  <p className="font-bold text-sm text-text-primary">Waiting in OPD Hall (Position #3)</p>
                </div>
                <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                  <span className="text-text-muted block mb-1">Assigned Department:</span>
                  <p className="font-bold text-sm text-text-primary">General Medicine / OPD Room 12</p>
                </div>
                <div className="bg-surface-muted p-3.5 rounded-xl border border-border-light">
                  <span className="text-text-muted block mb-1">Triage Priority:</span>
                  <p className="font-bold text-sm text-emerald-600">ESI Level 3 — Urgent Evaluation</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => navigate('/patient/documents')}>
                  Add Documents
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/patient/confirmation')} iconRight={ArrowRight}>
                  Review Clinical Summary
                </Button>
              </div>
            </Card>

            {/* AI Synthesized History of Present Illness (HPI) Card */}
            <Card>
              <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-primary font-heading">
                      History of Present Illness (HPI) — AI Synthesized
                    </h3>
                    <span className="text-xs text-text-muted">
                      Standard SOCRATES Clinical Semantics • Non-Diagnostic Pre-Intake
                    </span>
                  </div>
                </div>
                <Badge severity="info" size="sm">
                  Clinical Ready
                </Badge>
              </div>

              {/* Narrative Text */}
              <div className="bg-surface-muted/60 p-4 rounded-xl border border-border-light mb-4 space-y-2">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">English Clinical Narrative</p>
                <p className="text-sm text-text-primary leading-relaxed">
                  {generatedHPI.narrativeProse}
                </p>
                {generatedHPI.hindiNarrative && (
                  <div className="pt-2 border-t border-border-light/60">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">हिंदी सारांश (Hindi Summary)</p>
                    <p className="text-sm text-text-secondary leading-relaxed font-hindi">
                      {generatedHPI.hindiNarrative}
                    </p>
                  </div>
                )}
              </div>

              {/* SOCRATES Framework Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-surface-muted p-3.5 rounded-xl border border-border-light">
                <div className="p-2 rounded-lg bg-surface border border-border-light">
                  <span className="text-text-muted block text-[11px]">Site:</span>
                  <span className="font-bold text-text-primary">{generatedHPI.structured.site}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-border-light">
                  <span className="text-text-muted block text-[11px]">Onset:</span>
                  <span className="font-bold text-text-primary">{generatedHPI.structured.onset}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-border-light">
                  <span className="text-text-muted block text-[11px]">Character:</span>
                  <span className="font-bold text-text-primary">{generatedHPI.structured.character}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-border-light">
                  <span className="text-text-muted block text-[11px]">Radiation:</span>
                  <span className="font-bold text-text-primary">{generatedHPI.structured.radiation}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-border-light">
                  <span className="text-text-muted block text-[11px]">Associations:</span>
                  <span className="font-bold text-text-primary">{generatedHPI.structured.associations}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-border-light">
                  <span className="text-text-muted block text-[11px]">Aggravating:</span>
                  <span className="font-bold text-text-primary">{generatedHPI.structured.aggravating}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-border-light">
                  <span className="text-text-muted block text-[11px]">Relieving:</span>
                  <span className="font-bold text-text-primary">{generatedHPI.structured.relieving}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-border-light">
                  <span className="text-text-muted block text-[11px]">Severity:</span>
                  <span className="font-bold text-rose-600">{generatedHPI.structured.severity}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                <span>Non-diagnostic summary for physician verification. All data is patient-reported.</span>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: PREVIOUS CONSULTATIONS */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
              Hospital Consultation Archive ({previousConsultations.length})
            </h3>

            {previousConsultations.map(c => (
              <Card key={c.id} className="hover:border-primary-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border-light mb-3 gap-2">
                  <div>
                    <h4 className="font-bold text-text-primary text-base font-heading">{c.diagnosis}</h4>
                    <p className="text-xs text-text-muted">
                      {c.department} • {c.doctor} • {c.date}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {c.status}
                  </span>
                </div>

                <div className="text-xs text-text-secondary mb-3 space-y-1">
                  <p><strong className="text-text-primary">Chief Complaint:</strong> {c.chiefComplaint}</p>
                  <p><strong className="text-text-primary">Physician Notes:</strong> {c.notes}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-border-light">
                  <span className="text-text-muted">📎 {c.documentsCount} attached records</span>
                  <button className="text-primary-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                    View Full OPD Record <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* TAB 3: UPLOADED DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 text-xs">
                {['all', 'Prescription', 'Laboratory Report', 'Discharge Summary', 'Medical Certificate'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setDocCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                      docCategoryFilter === cat
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-surface border-border-light text-text-secondary hover:border-primary-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Documents' : cat}
                  </button>
                ))}
              </div>

              <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('/patient/documents')}>
                Upload New Document
              </Button>
            </div>

            {filteredDocs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredDocs.map(doc => (
                  <Card key={doc.id} className="relative">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-200">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-text-primary text-sm truncate">{doc.fileName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                            {doc.category || 'Prescription'}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mb-2">
                          OCR Status: {doc.status === 'processed' ? 'Digitized' : 'Uploaded'}
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveInspectorDoc(doc.extraction || { fileName: doc.fileName })}
                            className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect OCR
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-10 border-dashed border-2">
                <FileText className="w-8 h-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm font-semibold text-text-primary">No documents found in this category</p>
                <p className="text-xs text-text-muted mt-1">Tap above to scan or upload prescriptions and lab reports.</p>
              </Card>
            )}
          </div>
        )}

        {/* TAB 4: CONSOLIDATED MEDICAL HISTORY */}
        {activeTab === 'records' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-bold text-text-primary text-sm font-heading mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary-600" />
                Chronic Conditions (Past Medical)
              </h3>
              <div className="space-y-2 text-xs">
                {['Hypertension (Essential, since 2021)', 'Type 2 Diabetes Mellitus (since 2019)'].map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-surface-muted border border-border-light font-semibold text-text-primary">
                    • {c}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-text-primary text-sm font-heading mb-3 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-primary-600" />
                Past Surgical History
              </h3>
              <div className="space-y-2 text-xs">
                {['Appendectomy (2018, Laparoscopic at District Hospital)'].map((s, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-surface-muted border border-border-light font-semibold text-text-primary">
                    • {s}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-text-primary text-sm font-heading mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary-600" />
                Active Regular Medications
              </h3>
              <div className="space-y-2 text-xs">
                {['Telmisartan 40mg (Once Daily morning)', 'Metformin 500mg (Twice Daily after meals)', 'Rosuvastatin 10mg (Once Daily night)'].map((m, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-surface-muted border border-border-light font-semibold text-text-primary">
                    💊 {m}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-critical text-sm font-heading mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-critical" />
                Known Allergies & Contraindications
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-semibold">
                  ⚠️ Penicillin (Severe skin rash & urticaria documented in 2023)
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 5: MEDICAL TIMELINE */}
        {activeTab === 'timeline' && (
          <Card>
            <div className="pb-4 border-b border-border-light mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-text-primary text-base font-heading">
                  Chronological Medical History Timeline
                </h3>
                <p className="text-xs text-text-muted">
                  Integrated historical progression compiled from hospital consultations and OCR records
                </p>
              </div>
              <span className="text-xs text-primary-700 font-bold bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200">
                2018 — 2026
              </span>
            </div>

            <Timeline events={timelineEvents} />
          </Card>
        )}
      </div>

      {/* OCR Inspector Modal */}
      <DocumentInspectorModal
        isOpen={Boolean(activeInspectorDoc)}
        onClose={() => setActiveInspectorDoc(null)}
        documentData={activeInspectorDoc}
      />
    </div>
  )
}
