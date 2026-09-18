import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2, FileText, FlaskConical, Pill, AlertTriangle,
  Trash2, Plus, Edit3, Eye, Sparkles, ShieldCheck, Calendar,
  User, Stethoscope, Maximize2, X, ChevronDown, ChevronUp,
  Check, Activity, Info, HeartPulse, Sparkle
} from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import ArogyaDarpanLogo from '../../components/ArogyaDarpanLogo'
import { useLanguage } from '../../context/LanguageContext'
import { detectDrugInteractions } from '../../services/drugInteractionEngine'

export default function DocumentReview() {
  const navigate = useNavigate()
  const { t, lang } = useLanguage()

  // 1. Load active document list and OCR result from localStorage
  const [documents, setDocuments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('arogya_documents') || '[]')
    } catch {
      return []
    }
  })

  const [previewUrl, setPreviewUrl] = useState(() => {
    try {
      return localStorage.getItem('arogya_last_doc_preview') || ''
    } catch {
      return ''
    }
  })

  // 2. OCR Result State (Structured Clinical Data)
  const [ocrData, setOcrData] = useState(() => {
    try {
      const stored = localStorage.getItem('arogya_ocr_result')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.warn('Could not parse stored OCR result:', e)
    }

    // High quality default if no OCR run yet
    return {
      rawText: 'METRO CLINIC Rx\nDr. A. K. Patel, MD\nTab Metformin 500 mg 1-0-1 BD x 30 days\nTab Amlodipine 5 mg 1-0-0 OD x 30 days\nTab Aspirin 75 mg 0-1-0 OD x 30 days\nHbA1c: 8.4 %\nFBS: 168 mg/dL',
      documentType: 'Prescription',
      documentCategory: 'Prescription',
      classificationConfidence: 0.94,
      documentDate: new Date().toISOString().split('T')[0],
      doctorInfo: {
        name: 'Dr. A. K. Patel, MD',
        qualification: 'MD (Internal Medicine)',
        regNo: 'DMC-48291',
        clinicName: 'Metro Healthcare Clinic & Pathology Labs',
      },
      stampAndSignature: {
        detected: true,
        hasSignature: true,
        hasStamp: true,
        confidence: 0.92,
        signatory: 'Authorized Medical Officer'
      },
      extractedData: {
        diagnosis: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
        medications: [
          {
            id: 'med-1',
            name: 'Metformin',
            form: 'Tablet',
            strength: '500 mg',
            frequency: '1-0-1 (Twice Daily)',
            duration: '30 days',
            timing: 'After Food (PC)',
            confidence: 0.94,
          },
          {
            id: 'med-2',
            name: 'Amlodipine',
            form: 'Tablet',
            strength: '5 mg',
            frequency: '1-0-0 (Once Daily - Morning)',
            duration: '30 days',
            timing: 'After Food (PC)',
            confidence: 0.92,
          },
          {
            id: 'med-3',
            name: 'Aspirin',
            form: 'Tablet',
            strength: '75 mg',
            frequency: '0-1-0 (Once Daily - After Lunch)',
            duration: '30 days',
            timing: 'After Food (PC)',
            confidence: 0.91,
          },
        ],
        investigations: [
          {
            id: 'lab-1',
            test: 'HbA1c',
            name: 'HbA1c (Glycated Hemoglobin)',
            value: '8.4',
            unit: '%',
            referenceRange: '4.0 - 5.6 %',
            status: 'abnormal',
            direction: 'high',
            abnormalFlag: '↑ High',
            confidence: 0.95,
          },
          {
            id: 'lab-2',
            test: 'FBS',
            name: 'Fasting Blood Sugar (FBS)',
            value: '168',
            unit: 'mg/dL',
            referenceRange: '70 - 99 mg/dL',
            status: 'abnormal',
            direction: 'high',
            abnormalFlag: '↑ High',
            confidence: 0.93,
          },
          {
            id: 'lab-3',
            test: 'Serum Creatinine',
            name: 'Serum Creatinine',
            value: '1.2',
            unit: 'mg/dL',
            referenceRange: '0.6 - 1.2 mg/dL',
            status: 'normal',
            direction: 'normal',
            abnormalFlag: 'Normal',
            confidence: 0.90,
          },
        ],
        advice: [
          'Low salt & diabetic diet strictly recommended',
          'Regular brisk walking for 30 minutes daily',
          'Review in clinic with repeat HbA1c in 3 months',
        ],
        allergies: [],
      },
      drugInteractions: [],
      confidence: 0.93,
    }
  })

  // Editable lists
  const [medications, setMedications] = useState(ocrData?.extractedData?.medications || [])
  const [investigations, setInvestigations] = useState(ocrData?.extractedData?.investigations || [])
  const [diagnoses, setDiagnoses] = useState(ocrData?.extractedData?.diagnosis || [])
  const [adviceList, setAdviceList] = useState(ocrData?.extractedData?.advice || [])

  // Modals & Viewers
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [showRawText, setShowRawText] = useState(false)
  const [newMedModal, setNewMedModal] = useState(false)
  const [newLabModal, setNewLabModal] = useState(false)

  // New item draft states
  const [newMed, setNewMed] = useState({
    name: '',
    strength: '500 mg',
    form: 'Tablet',
    frequency: '1-0-1 (Twice Daily)',
    duration: '30 days',
    timing: 'After Food (PC)',
  })

  const [newLab, setNewLab] = useState({
    test: '',
    value: '',
    unit: 'mg/dL',
    status: 'normal',
  })

  // Re-run drug interaction check whenever medications change
  const drugInteractions = detectDrugInteractions(medications)

  // Handlers for Medications
  const handleUpdateMedication = (id, field, value) => {
    setMedications(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const handleDeleteMedication = (id) => {
    setMedications(prev => prev.filter(m => m.id !== id))
  }

  const handleAddMedication = (e) => {
    e?.preventDefault()
    if (!newMed.name.trim()) return
    const created = {
      id: `med-${Date.now()}`,
      name: newMed.name.trim(),
      strength: newMed.strength.trim() || 'Standard dose',
      form: newMed.form || 'Tablet',
      frequency: newMed.frequency,
      duration: newMed.duration || '30 days',
      timing: newMed.timing,
      confidence: 1.0,
    }
    setMedications(prev => [...prev, created])
    setNewMed({ name: '', strength: '500 mg', form: 'Tablet', frequency: '1-0-1 (Twice Daily)', duration: '30 days', timing: 'After Food (PC)' })
    setNewMedModal(false)
  }

  // Handlers for Lab investigations
  const handleUpdateLab = (id, field, value) => {
    setInvestigations(prev =>
      prev.map(l => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  const handleDeleteLab = (id) => {
    setInvestigations(prev => prev.filter(l => l.id !== id))
  }

  const handleAddLab = (e) => {
    e?.preventDefault()
    if (!newLab.test.trim() || !newLab.value.trim()) return
    const isAbnormal = newLab.status === 'abnormal'
    const created = {
      id: `lab-${Date.now()}`,
      test: newLab.test.trim(),
      name: newLab.test.trim(),
      value: newLab.value.trim(),
      unit: newLab.unit.trim(),
      referenceRange: 'Standard',
      status: newLab.status,
      direction: isAbnormal ? 'high' : 'normal',
      abnormalFlag: isAbnormal ? '↑ High' : 'Normal',
      confidence: 1.0,
    }
    setInvestigations(prev => [...prev, created])
    setNewLab({ test: '', value: '', unit: 'mg/dL', status: 'normal' })
    setNewLabModal(false)
  }

  // Save confirmed data and proceed to confirmation
  const handleConfirmAndContinue = () => {
    const updatedOcrResult = {
      ...ocrData,
      extractedData: {
        ...ocrData.extractedData,
        medications,
        investigations,
        diagnosis: diagnoses,
        advice: adviceList,
      },
      drugInteractions,
      verifiedByPatient: true,
      verifiedAt: new Date().toISOString(),
    }

    // 1. Store updated OCR result
    localStorage.setItem('arogya_ocr_result', JSON.stringify(updatedOcrResult))

    // 2. Sync to active documents array
    if (documents.length > 0) {
      const updatedDocs = documents.map((doc, idx) => {
        if (idx === 0) {
          return {
            ...doc,
            ocrResult: updatedOcrResult,
            extraction: updatedOcrResult,
            status: 'verified',
          }
        }
        return doc
      })
      localStorage.setItem('arogya_documents', JSON.stringify(updatedDocs))
    }

    // 3. Move to next step
    navigate('/patient/confirmation')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans">
      <StitchAppHeader
        title={t('reviewDocuments', 'Review Extracted Medical Data')}
        showBack
        onBack={() => navigate('/patient/documents')}
      />

      <main className="mx-auto max-w-2xl px-4 py-6 pb-32 space-y-6">
        {/* Step Progress Pill & Headline */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#174ea6] border border-blue-200 text-xs font-bold">
            <Sparkles className="size-3.5 text-[#174ea6]" />
            <span>AI OCR Medical Entity Extraction</span>
          </div>
          <span className="text-xs font-bold text-slate-500">Step 4 of 5</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            {t('extractedInfo', 'Review Extracted Medical Record')}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            {t('reviewInfo', 'Our clinical OCR engine read your uploaded document. Please check the medications, dosages, and test results below and make any corrections if needed.')}
          </p>
        </div>

        {/* 1. Document Overview & Source Preview Card */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              {previewUrl ? (
                <div
                  className="relative group cursor-pointer size-16 sm:size-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0 shadow-xs"
                  onClick={() => setImageModalOpen(true)}
                >
                  <img
                    src={previewUrl}
                    alt="Prescription Scan"
                    className="size-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <Maximize2 className="size-5" />
                  </div>
                </div>
              ) : (
                <div className="size-16 sm:size-20 rounded-2xl bg-blue-50 text-[#174ea6] border border-blue-200/80 flex items-center justify-center shrink-0">
                  <FileText className="size-8" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#174ea6] border border-blue-200">
                    <CheckCircle2 className="size-3 text-[#174ea6]" />
                    {ocrData.documentCategory || 'Prescription'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {Math.round((ocrData.confidence || 0.92) * 100)}% Confidence
                  </span>
                </div>

                <h3 className="mt-1 text-base font-bold text-slate-900 font-heading">
                  {ocrData.doctorInfo?.clinicName || 'Metro Healthcare Clinic & Pathology'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  {ocrData.doctorInfo?.name && (
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Stethoscope className="size-3 text-[#174ea6]" />
                      {ocrData.doctorInfo.name}
                    </span>
                  )}
                  {ocrData.documentDate && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="size-3" />
                      {ocrData.documentDate}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => setImageModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174ea6] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>View Image</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowRawText(!showRawText)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <span>Raw OCR</span>
                {showRawText ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>
            </div>
          </div>

          {/* Collapsible Raw OCR Transcript */}
          {showRawText && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Raw Tesseract OCR Stream
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Engine: OCR v2.4</span>
              </div>
              <pre className="p-3.5 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {ocrData.rawText || 'No text extracted.'}
              </pre>
            </div>
          )}
        </section>

        {/* 2. Drug-Drug Interaction Safety Alert (CDS) */}
        {drugInteractions.length > 0 && (
          <section className="rounded-3xl border border-amber-300 bg-amber-50/90 p-5 text-amber-950 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <AlertTriangle className="size-5 text-amber-600 shrink-0" />
              <span>Clinical Decision Alert: Drug Interaction Detected</span>
            </div>
            {drugInteractions.map((alert, idx) => (
              <div key={idx} className="bg-white/80 rounded-2xl p-3.5 border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{alert.drug1} + {alert.drug2}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] uppercase font-extrabold">
                    {alert.severity || 'Moderate Risk'}
                  </span>
                </div>
                <p className="text-slate-700 leading-normal">{alert.description || alert.message}</p>
                <p className="text-amber-800 font-semibold italic">Recommendation: {alert.recommendation || 'Physician will review dosage adjustments during consultation.'}</p>
              </div>
            ))}
          </section>
        )}

        {/* 3. Extracted Diagnoses & Indications */}
        {diagnoses.length > 0 && (
          <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 font-heading">
                <HeartPulse className="size-5 text-[#174ea6]" />
                <span>Clinical Diagnoses & Indications</span>
              </h2>
              <span className="text-xs font-bold text-[#174ea6] bg-blue-50 px-2.5 py-0.5 rounded-full">
                {diagnoses.length} Found
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {diagnoses.map((diag, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs font-bold text-[#174ea6]"
                >
                  <Activity className="size-3.5 text-[#174ea6]" />
                  <span>{diag}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Extracted Prescribed Medications List (Editable) */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 font-heading">
                <Pill className="size-5 text-[#174ea6]" />
                <span>{t('medicinesFound', 'Prescribed Medications (Rx)')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify medicine name, strength, frequency and duration
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewMedModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#174ea6] text-white hover:bg-[#123b79] px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs"
            >
              <Plus className="size-4" />
              <span>Add Medicine</span>
            </button>
          </div>

          {medications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
              <Pill className="size-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium mt-2">No medications detected on this page</p>
              <button
                type="button"
                onClick={() => setNewMedModal(true)}
                className="mt-3 text-xs font-bold text-[#174ea6] hover:underline cursor-pointer"
              >
                + Add Medication Manually
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {medications.map((med) => (
                <article
                  key={med.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2.5">
                      {/* Name & Strength Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Medicine Name
                          </label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleUpdateMedication(med.id, 'name', e.target.value)}
                            className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#174ea6]/40"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Strength / Dose
                          </label>
                          <input
                            type="text"
                            value={med.strength}
                            onChange={(e) => handleUpdateMedication(med.id, 'strength', e.target.value)}
                            className="w-full text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#174ea6]/40"
                          />
                        </div>
                      </div>

                      {/* Frequency & Duration Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Frequency & Dosage Pattern
                          </label>
                          <select
                            value={med.frequency}
                            onChange={(e) => handleUpdateMedication(med.id, 'frequency', e.target.value)}
                            className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#174ea6]/40 cursor-pointer"
                          >
                            <option value="1-0-1 (Twice Daily)">1-0-1 (Twice Daily - Morning & Night)</option>
                            <option value="1-0-0 (Once Daily - Morning)">1-0-0 (Once Daily - Morning)</option>
                            <option value="0-0-1 (Once Daily - At Bedtime)">0-0-1 (Once Daily - At Bedtime)</option>
                            <option value="1-1-1 (Thrice Daily)">1-1-1 (Thrice Daily - Morning, Noon, Night)</option>
                            <option value="1-1-1-1 (Four Times Daily)">1-1-1-1 (Four Times Daily)</option>
                            <option value="SOS (As Needed / If Required)">SOS (As Needed / If Required)</option>
                            <option value="STAT (Immediate Single Dose)">STAT (Immediate Single Dose)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Duration & Timing
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={med.duration}
                              onChange={(e) => handleUpdateMedication(med.id, 'duration', e.target.value)}
                              placeholder="e.g. 30 days"
                              className="w-1/2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#174ea6]/40"
                            />
                            <select
                              value={med.timing || 'After Food (PC)'}
                              onChange={(e) => handleUpdateMedication(med.id, 'timing', e.target.value)}
                              className="w-1/2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#174ea6]/40 cursor-pointer"
                            >
                              <option value="After Food (PC)">After Food (PC)</option>
                              <option value="Before Food (AC)">Before Food (AC)</option>
                              <option value="Empty Stomach">Empty Stomach</option>
                              <option value="With Milk">With Milk</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteMedication(med.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer shrink-0 mt-6"
                      title="Remove this medication"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 5. Extracted Laboratory Results (Editable) */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 font-heading">
                <FlaskConical className="size-5 text-[#174ea6]" />
                <span>{t('labResults', 'Laboratory & Diagnostic Findings')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Blood biochemistry, vitals, and pathology test values
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewLabModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174ea6] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition cursor-pointer border border-blue-200/80"
            >
              <Plus className="size-4" />
              <span>Add Test</span>
            </button>
          </div>

          {investigations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
              <FlaskConical className="size-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium mt-2">No lab test values found on this document</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {investigations.map((lab) => (
                <div
                  key={lab.id}
                  className={`rounded-2xl border p-4 transition space-y-2 ${
                    lab.status === 'abnormal'
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800">
                      {lab.name || lab.test}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteLab(lab.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={lab.value}
                      onChange={(e) => handleUpdateLab(lab.id, 'value', e.target.value)}
                      className="w-24 text-base font-extrabold text-slate-900 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-center"
                    />
                    <span className="text-xs font-semibold text-slate-500">{lab.unit}</span>

                    <select
                      value={lab.status}
                      onChange={(e) => handleUpdateLab(lab.id, 'status', e.target.value)}
                      className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                        lab.status === 'abnormal'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <option value="normal">Normal</option>
                      <option value="abnormal">Abnormal</option>
                    </select>
                  </div>
                  {lab.referenceRange && (
                    <p className="text-[11px] text-slate-400">Ref: {lab.referenceRange}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. Clinical Advice & Follow-up Notice */}
        {adviceList.length > 0 && (
          <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
            <h2 className="font-bold text-slate-900 text-base font-heading">
              Physician Advice & Follow-Up Notes
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
              {adviceList.map((adv, idx) => (
                <li key={idx} className="leading-relaxed">{adv}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Doctor Verification Notice Pill */}
        <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-200/80 p-4 text-xs sm:text-sm text-[#123b79]">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#174ea6]" />
          <p className="leading-relaxed">
            {t('doctorWillVerify', 'All extracted information will be presented directly to your consulting physician for official verification and ABDM FHIR health record sync.')}
          </p>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-4 py-3.5 pb-safe backdrop-blur-md z-40">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/patient/documents')}
            className="rounded-full border border-slate-300 hover:bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition cursor-pointer"
          >
            {t('back', 'Back')}
          </button>
          <button
            type="button"
            onClick={handleConfirmAndContinue}
            className="flex-1 rounded-full bg-[#174ea6] hover:bg-[#123b79] px-5 py-3.5 text-sm font-bold text-white transition cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Check className="size-4" />
            <span>{t('continueConfirmation', 'Confirm & Continue to Summary')}</span>
          </button>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {imageModalOpen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl p-4 overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="size-4 text-[#174ea6]" />
                Original Uploaded Prescription / Report
              </h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Document Full Preview"
                className="max-h-[75vh] w-auto object-contain rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {newMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Pill className="size-5 text-[#174ea6]" />
                Add Prescribed Medication
              </h3>
              <button
                type="button"
                onClick={() => setNewMedModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedication} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol, Metformin, Telmisartan"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-[#174ea6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 mg"
                    value={newMed.strength}
                    onChange={(e) => setNewMed({ ...newMed, strength: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Form</label>
                  <select
                    value={newMed.form}
                    onChange={(e) => setNewMed({ ...newMed, form: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Drops">Drops</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Dosage Frequency</label>
                <select
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 p-2.5"
                >
                  <option value="1-0-1 (Twice Daily)">1-0-1 (Twice Daily - Morning & Night)</option>
                  <option value="1-0-0 (Once Daily - Morning)">1-0-0 (Once Daily - Morning)</option>
                  <option value="0-0-1 (Once Daily - At Bedtime)">0-0-1 (Once Daily - At Bedtime)</option>
                  <option value="1-1-1 (Thrice Daily)">1-1-1 (Thrice Daily - Morning, Noon, Night)</option>
                  <option value="SOS (As Needed / If Required)">SOS (As Needed / If Required)</option>
                  <option value="STAT (Immediate Single Dose)">STAT (Immediate Single Dose)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 days"
                    value={newMed.duration}
                    onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Meal Timing</label>
                  <select
                    value={newMed.timing}
                    onChange={(e) => setNewMed({ ...newMed, timing: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5"
                  >
                    <option value="After Food (PC)">After Food (PC)</option>
                    <option value="Before Food (AC)">Before Food (AC)</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setNewMedModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#174ea6] text-white hover:bg-[#123b79]"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lab Modal */}
      {newLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FlaskConical className="size-5 text-[#174ea6]" />
                Add Laboratory Finding
              </h3>
              <button
                type="button"
                onClick={() => setNewLabModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddLab} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Test Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fasting Blood Glucose, Serum Creatinine"
                  value={newLab.test}
                  onChange={(e) => setNewLab({ ...newLab, test: e.target.value })}
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-[#174ea6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Value *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 140"
                    value={newLab.value}
                    onChange={(e) => setNewLab({ ...newLab, value: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. mg/dL, %"
                    value={newLab.unit}
                    onChange={(e) => setNewLab({ ...newLab, unit: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Status</label>
                <select
                  value={newLab.status}
                  onChange={(e) => setNewLab({ ...newLab, status: e.target.value })}
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5"
                >
                  <option value="normal">Normal Range</option>
                  <option value="abnormal">Abnormal (High / Low)</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setNewLabModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#174ea6] text-white hover:bg-[#123b79]"
                >
                  Save Test Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
