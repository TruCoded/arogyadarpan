import { useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ArrowLeft, Heart, MessageCircle, Volume2, VolumeX, Sun,
  LogOut, FormInput, ListFilter, CheckSquare, Square, Calendar, Hash, Sparkles,
  Stethoscope, Leaf, Activity, Zap, RefreshCw, AlertTriangle, RotateCcw, Edit3
} from 'lucide-react'
import Button from '../../components/Button'
import Card from '../../components/Card'
import BionicKioskShell from '../../components/kiosk/BionicKioskShell'
import { EcgLine } from '../../components/kiosk/Telemetry'
import { bionicSymptomTiles } from '../../data/bionicData'
import VoiceRecorder from '../../components/VoiceRecorder'
import AudioControlsBar from '../../components/AudioControlsBar'
import ConversationalVoiceModal from '../../components/ConversationalVoiceModal'
import RedFlagAlertModal from '../../components/RedFlagAlertModal'
import CompletenessTracker from '../../components/CompletenessTracker'
import ClinicalSignalCard from '../../components/ClinicalSignalCard'
import SymptomRadarCard from '../../components/SymptomRadarCard'
import AYUSHModeToggle from '../../components/AYUSHModeToggle'
import LanguageSelector from '../../components/LanguageSelector'
import TouchNumericKeypad from '../../components/TouchNumericKeypad'
import TouchDatePicker from '../../components/TouchDatePicker'
import SessionTimeoutModal from '../../components/SessionTimeoutModal'
import ClinicalHistoryFormView from '../../components/ClinicalHistoryFormView'
import { useInterview } from '../../hooks/useInterview'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { useSessionTimeout } from '../../hooks/useSessionTimeout'
import { useLanguage } from '../../context/LanguageContext'
import { COMPLAINT_OPTIONS, getLocalizedQuestion, getLocalizedOption } from '../../data/questionBank'
import { clearPatientSession } from '../../services/sessionStore'
import { normalizeVoiceInput } from '../../services/voiceNormalizationEngine'
import { evaluateRedFlags } from '../../services/redFlagRules'
import { playLanguageAudio, stopLanguageAudio } from '../../services/audioTtsService'

export default function InterviewScreen() {
  const navigate = useNavigate()
  const { lang, t, speechLocale, currentLanguageMeta } = useLanguage()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showFullForm, setShowFullForm] = useState(false)
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false)

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    responses,
    isComplete,
    completeness,
    completenessPercent,
    triageData,
    mode,
    setMode,
    isLowLiteracy,
    setIsLowLiteracy,
    submitResponse,
    nextQuestion,
    previousQuestion,
    resetInterview,
  } = useInterview()

  const [textInput, setTextInput] = useState('')
  const [numberInput, setNumberInput] = useState('')
  const [selectedOptions, setSelectedOptions] = useState([])
  const [dropdownValue, setDropdownValue] = useState('')
  const [dateValue, setDateValue] = useState('')

  // Speech Rate & Volume States for Accessible TTS (elderly & low-literacy)
  const [speechRate, setSpeechRate] = useState(isLowLiteracy ? 0.75 : 0.92)
  const [volume, setVolume] = useState(1.0)

  // Conversational Voice AI Modal & Red-Flag States
  const [showConversationalModal, setShowConversationalModal] = useState(false)
  const [acknowledgedRedFlags, setAcknowledgedRedFlags] = useState([])
  const [contradictionAlert, setContradictionAlert] = useState(null)

  // Evaluate real-time Red Flags across current responses
  const redFlagEvaluation = useMemo(() => {
    return evaluateRedFlags(responses)
  }, [responses])

  const activeRedFlag = redFlagEvaluation.topAlert
  const isRedFlagOpen = Boolean(
    activeRedFlag &&
    activeRedFlag.priority === 'critical' &&
    !acknowledgedRedFlags.includes(activeRedFlag.id)
  )

  // Inactivity Timeout Tracker (3-minute idle kiosk timeout)
  const {
    isWarning: isTimeoutWarning,
    secondsLeft: timeoutSecondsLeft,
    resetTimeout
  } = useSessionTimeout({
    idleMinutes: 3,
    warningSeconds: 30,
    onTimeout: () => {
      clearPatientSession()
      navigate('/patient/language')
    },
    enabled: !isComplete
  })

  const [voiceMatchStatus, setVoiceMatchStatus] = useState(null)

  const handleVoiceResult = useCallback((transcriptText) => {
    setTextInput(prev => (prev ? prev + ' ' + transcriptText : transcriptText).trim())

    if (currentQuestion) {
      const norm = normalizeVoiceInput(transcriptText, currentQuestion)
      if (norm && norm.confidence >= 0.88 && norm.structuredValue !== undefined && norm.matchedOption) {
        setVoiceMatchStatus({
          active: true,
          heard: transcriptText,
          normalized: Array.isArray(norm.structuredValue) ? norm.structuredValue.join(', ') : String(norm.structuredValue),
          explanation: norm.explanation
        })

        if (currentQuestion.type === 'yes_no' || currentQuestion.type === 'complaint_select' || currentQuestion.type === 'single_select' || currentQuestion.type === 'dropdown') {
          submitResponse(currentQuestion.id, transcriptText, norm.structuredValue, 'voice')
          setTimeout(() => {
            setVoiceMatchStatus(null)
            nextQuestion()
          }, 900)
        } else if (currentQuestion.type === 'number') {
          setNumberInput(String(norm.structuredValue))
        } else if (currentQuestion.type === 'multi_select') {
          setSelectedOptions(Array.isArray(norm.structuredValue) ? norm.structuredValue : [norm.structuredValue])
        }
      }
    }
  }, [currentQuestion, submitResponse, nextQuestion])

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
  } = useVoiceInput({
    lang: speechLocale,
    onResult: handleVoiceResult,
  })

  useEffect(() => {
    return () => {
      stopLanguageAudio()
    }
  }, [])

  // Sync state when question changes
  useEffect(() => {
    setTextInput('')
    setNumberInput('')
    setSelectedOptions([])
    setDropdownValue('')
    setDateValue('')
  }, [currentQuestion?.id])

  // Dynamic Multi-Language Speech Synthesis (TTS)
  const handleReadAloud = (customRate = speechRate, customVol = volume) => {
    if (!currentQuestion) return

    if (isSpeaking) {
      stopLanguageAudio()
      setIsSpeaking(false)
      return
    }

    const questionToSpeak = getLocalizedQuestion(currentQuestion, lang)
    setIsSpeaking(true)
    playLanguageAudio(
      questionToSpeak,
      lang,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    )
  }

  // Handle Free Conversational Natural Speech AI Intake
  const handleApplyConversationalIntake = (intakeData) => {
    if (!intakeData) return

    // 1. Primary complaint
    if (intakeData.primaryComplaint?.id) {
      submitResponse('chief_complaint', intakeData.rawTranscript, intakeData.primaryComplaint.id, 'voice')
    }

    // 2. Duration / Onset
    if (intakeData.duration) {
      submitResponse('socrates_onset', intakeData.duration, intakeData.duration, 'voice')
    }

    // 3. Associated symptoms
    if (intakeData.associatedSymptoms && intakeData.associatedSymptoms.length > 0) {
      const symVals = intakeData.associatedSymptoms.map(s => s.id)
      submitResponse('socrates_associations', intakeData.associatedSymptoms.map(s => s.label).join(', '), symVals, 'voice')
    }

    // 4. Severity
    if (intakeData.severity) {
      submitResponse('socrates_severity', String(intakeData.severity), intakeData.severity, 'voice')
    }

    // 5. Current medications if detected
    if (intakeData.medications && intakeData.medications.length > 0) {
      const medStr = intakeData.medications.map(m => `${m.medication} ${m.dose || ''}`).join(', ')
      submitResponse('current_medications', medStr, medStr, 'voice')
    }

    // 6. Diseases if detected
    if (intakeData.diseases && intakeData.diseases.length > 0) {
      const disList = intakeData.diseases.map(d => d.name)
      submitResponse('past_medical', disList.join(', '), disList, 'voice')
    }

    setShowConversationalModal(false)
    setTimeout(nextQuestion, 500)
  }

  // Auto-save responses to localStorage whenever updated
  useEffect(() => {
    if (responses.length > 0) {
      localStorage.setItem('arogya_responses', JSON.stringify(responses))
      localStorage.setItem('arogya_triage', JSON.stringify(triageData))
    }
  }, [responses, triageData])

  const handleEndSession = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    clearPatientSession()
    navigate('/')
  }

  // If intake is complete, render an interactive summary rather than a blank or redirect screen
  if (isComplete) {
    const chiefVal = responses.find(r => r.questionId === 'chief_complaint')?.structuredValue || 'General Consultation'
    const chiefLabel = COMPLAINT_OPTIONS.find((item) => item.id === chiefVal)
    return (
      <BionicKioskShell
        activeTrack={mode === 'ayush' ? 'ayush' : 'modern'}
        onTrackChange={(newTrack) => setMode(newTrack === 'ayush' ? 'ayush' : 'allopathic')}
      >
        <div className="max-w-2xl mx-auto py-6 sm:py-10 text-center select-none space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="size-20 rounded-3xl bg-gradient-to-tr from-emerald to-teal-700 flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-600/25"
          >
            <CheckSquare className="size-10" />
          </motion.div>

          <div>
            <span className="status-chip bg-emerald-soft text-emerald font-bold mb-2">
              {t('intakeCompleted')} • 100%
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {t('responsesSaved')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto mt-1">
              {t('responsesSavedDesc')}
            </p>
          </div>

          {/* Quick Summary Card */}
          <div className="glass-card p-4 sm:p-6 bg-white border border-slate-200/80 shadow-xs rounded-2xl text-left space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('intakeSummary')}
              </span>
              <span className="text-xs font-bold text-cobalt font-mono">
                {responses.length} {t('questionsAnswered')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('chiefComplaint')}</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block capitalize">
                  {chiefLabel ? getLocalizedOption(chiefLabel, lang) : String(chiefVal).replace(/_/g, ' ')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('triageStatus')}</span>
                <span className="font-bold text-emerald text-sm mt-0.5 block">
                  {triageData?.priority === 'critical' ? `⚠️ ${t('priorityReviewRequired')}` : `✓ ${t('standardTriageReady')}`}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                resetInterview()
              }}
              className="btn-bionic-outline w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="size-4" />
              <span>{t('retakeIntake')}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/patient/documents')}
              className="btn-bionic w-full sm:w-auto px-7 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold shadow-cobalt flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('continueDocuments')}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </BionicKioskShell>
    )
  }

  // Graceful fallback if no question is active
  if (!currentQuestion) {
    return (
      <BionicKioskShell
        activeTrack={mode === 'ayush' ? 'ayush' : 'modern'}
        onTrackChange={(newTrack) => setMode(newTrack === 'ayush' ? 'ayush' : 'allopathic')}
      >
        <div className="max-w-md mx-auto py-12 text-center select-none space-y-4">
          <div className="size-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Activity className="size-8" />
          </div>
          <h2 className="font-heading font-bold text-lg text-slate-900">
            {t('intakeSession')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('readyStart')}
          </p>
          <button
            onClick={() => resetInterview()}
            className="btn-bionic px-6 py-3 rounded-full text-white text-xs font-bold shadow-cobalt mx-auto"
          >
            {t('startQuestionnaire')}
          </button>
        </div>
      </BionicKioskShell>
    )
  }

  const handleSelectOption = (value) => {
    if (currentQuestion.type === 'multi_select') {
      setSelectedOptions(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      )
    } else {
      submitResponse(currentQuestion.id, '', value, 'touch')
      setTextInput('')
      setNumberInput('')
      setSelectedOptions([])
      setTimeout(nextQuestion, 250)
    }
  }

  const optionsNeedTextInput = ['single_select', 'multi_select'].includes(currentQuestion.type) && !['en', 'hi'].includes(lang)

  const handleSubmitCurrent = () => {
    let value = ''
    if (currentQuestion.type === 'text') value = textInput
    else if (currentQuestion.type === 'number') value = parseInt(numberInput, 10) || numberInput
    else if (currentQuestion.type === 'multi_select') value = optionsNeedTextInput ? textInput : selectedOptions
    else if (currentQuestion.type === 'single_select') value = textInput
    else if (currentQuestion.type === 'dropdown' || currentQuestion.type === 'select') value = dropdownValue
    else if (currentQuestion.type === 'date') value = dateValue

    // Clinical Logic Contradiction Check for surgical details
    if (currentQuestion.id === 'surgical_details') {
      const cleanInput = String(value || textInput || transcript || '').trim().toLowerCase()
      const isNegative = /^(no|none|nahi|na|nhi|nothing|nil|never|n\/a|not having|no surgery|kuch nahi|koi nahi|koi nahi hai|n)$/i.test(cleanInput)
      
      const pastSurgResp = responses.find(r => r.questionId === 'past_surgical')
      const hasSurgerySelected = pastSurgResp && (
        (Array.isArray(pastSurgResp.structuredValue) && pastSurgResp.structuredValue.length > 0 && !pastSurgResp.structuredValue.includes('none')) ||
        (typeof pastSurgResp.structuredValue === 'string' && pastSurgResp.structuredValue !== 'none' && pastSurgResp.structuredValue !== '' && !pastSurgResp.structuredValue.toLowerCase().includes('none'))
      )

      if (hasSurgerySelected && isNegative) {
        setContradictionAlert({
          title: t('contradictionTitle', 'Contradiction Detected: Surgery Details'),
          message: t('contradictionMsg', 'You previously selected having had a prior surgery. Answering "No" or "None" contradicts your previous response. Please enter the approximate year / hospital (e.g., "2019 at District Hospital") or update your previous answer if you have not had surgery.'),
        })
        return
      }
    }

    submitResponse(currentQuestion.id, textInput || transcript, value, 'touch')
    setTextInput('')
    setNumberInput('')
    setSelectedOptions([])
    setDropdownValue('')
    setDateValue('')
    nextQuestion()
  }

  const handleResolveContradictionNoSurgery = () => {
    submitResponse('past_surgical', 'No Prior Surgeries', ['none'], 'touch')
    setContradictionAlert(null)
    setTextInput('')
    setTimeout(nextQuestion, 150)
  }

  const handleComplaintSelect = (complaintId) => {
    submitResponse('chief_complaint', '', complaintId, 'touch')
    setTextInput('')
    setTimeout(nextQuestion, 250)
  }

  const questionText = getLocalizedQuestion(currentQuestion, lang)

  return (
    <BionicKioskShell
      activeTrack={mode === 'ayush' ? 'ayush' : 'modern'}
      onTrackChange={(newTrack) => setMode(newTrack === 'ayush' ? 'ayush' : 'allopathic')}
    >
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 select-none">
        {/* ── Left Column: Clinical Questionnaire (7 cols) ── */}
        <section className="flex flex-col justify-between">
          <div>
            {/* Top Title & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {t('healthInterview', 'Health interview')}
                </h1>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                  {mode === 'ayush'
                    ? `AYUSH • ${t('structuredHistory')}`
                    : `${t('modernMedicine')} • ${t('structuredHistory')}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {lang === 'en' && <button
                  onClick={() => setShowFullForm(!showFullForm)}
                  className="glass-pill px-3 py-1.5 text-xs font-bold text-cobalt border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                >
                  {showFullForm ? t('stepView') : t('fullForm')}
                </button>}
                <button
                  onClick={() => setIsLowLiteracy(!isLowLiteracy)}
                  className={`glass-pill px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    isLowLiteracy ? 'bg-amber text-slate-900' : 'text-slate-600 border border-slate-200'
                  }`}
                >
                  {isLowLiteracy ? 'A+ ON' : 'A+'}
                </button>
              </div>
            </div>

            {/* FULL FORM VIEW OVERLAY */}
            {showFullForm ? (
              <div className="glass-card p-5 bg-white border border-slate-200/80 shadow-xs max-h-[68vh] overflow-y-auto">
                <ClinicalHistoryFormView
                  responses={responses}
                  onUpdateResponse={(qId, val) => submitResponse(qId, '', val, 'form_edit')}
                  onClose={() => setShowFullForm(false)}
                />
              </div>
            ) : (
              /* STEP QUESTION CARD */
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="glass-card p-3 sm:p-5 md:p-6 bg-white border border-slate-200/80 shadow-xs rounded-2xl"
              >
                {/* Section Badge & Question Counter */}
                <div className="flex items-center justify-between mb-3">
                  <span className="status-chip bg-cobalt-soft text-cobalt font-bold text-[10px] sm:text-[11px]">
                    {t('question')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      {currentIndex + 1} / {totalQuestions}
                    </span>
                    <div className="w-16 sm:w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cobalt rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Question Prompt */}
                <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 font-heading mb-1 leading-snug">
                  {questionText}
                </h2>
                {lang === 'en' && (currentQuestion.hindi || currentQuestion.questionHi) && (
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-5">
                    {currentQuestion.hindi || currentQuestion.questionHi}
                  </p>
                )}

                {/* 1. COMPLAINT SELECTION WITH BIONIC TOUCH TILES */}
                {currentQuestion.type === 'complaint_select' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t('speakOrChoose', 'Choose an option')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {COMPLAINT_OPTIONS.slice(0, 6).map((tile) => (
                        <button
                          key={tile.id}
                          type="button"
                          onClick={() => handleComplaintSelect(tile.id)}
                          className="glass-card tile-lift p-3 sm:p-3.5 text-left border border-slate-200/80 bg-white hover:border-cobalt transition-all cursor-pointer shadow-xs flex flex-col justify-between h-24 sm:h-28"
                        >
                          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-xl shadow-xs">
                            {tile.icon || '🩺'}
                          </span>
                          <div>
                            <span className="block text-xs sm:text-sm font-bold text-slate-900">
                              {getLocalizedOption(tile, lang)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Additional Complaints */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 mb-2">{t('other', 'Other')}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {COMPLAINT_OPTIONS.filter((c) => !['chest_pain', 'fever', 'breathing', 'headache', 'stomach_pain', 'cough'].includes(c.id)).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleComplaintSelect(opt.id)}
                            className="glass-card tile-lift p-2.5 text-left text-xs font-bold text-slate-800 border border-slate-200/70 hover:border-cobalt transition cursor-pointer"
                          >
                            <span className="text-base mr-1.5">{opt.icon}</span>
                            {opt.labels && opt.labels[lang] ? opt.labels[lang] : opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SCALE / PAIN SEVERITY SLIDER */}
                {(currentQuestion.type === 'scale' || currentQuestion.id === 'pain_severity' || currentQuestion.id === 'socrates_severity') && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>1 • {t('mild')}</span>
                      <span className="text-sm font-black text-white px-3 py-1 rounded-full bg-cobalt shadow-cobalt">
                        {numberInput || '5'} / 10
                      </span>
                      <span>10 • {t('worst')}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={numberInput || 5}
                      onChange={(e) => setNumberInput(e.target.value)}
                      className="w-full accent-[var(--cobalt)] cursor-pointer h-2.5 bg-slate-200 rounded-lg"
                      aria-label={t('confirmSeverity')}
                    />
                    <div className="flex justify-end pt-1">
                      <Button
                        size="md"
                        onClick={() => handleSelectOption(String(Math.min(10, Math.max(1, parseInt(numberInput, 10) || 5))))}
                        className="bg-cobalt text-white shadow-cobalt font-bold text-xs"
                      >
                        {t('confirmSeverity')} ({Math.min(10, Math.max(1, parseInt(numberInput, 10) || 5))}/10)
                      </Button>
                    </div>
                  </div>
                )}

                {/* 3. YES / NO BUTTONS */}
                {currentQuestion.type === 'yes_no' && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center py-3 sm:py-4">
                    <button
                      type="button"
                      onClick={() => handleSelectOption('yes')}
                      className="glass-card tile-lift w-full sm:flex-1 sm:max-w-[180px] py-3.5 sm:py-4 rounded-2xl text-center font-bold text-base bg-emerald-soft text-emerald border border-emerald/30 hover:bg-emerald hover:text-white transition cursor-pointer"
                    >
                      {t('yes', 'Yes / हाँ')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectOption('no')}
                      className="glass-card tile-lift w-full sm:flex-1 sm:max-w-[180px] py-3.5 sm:py-4 rounded-2xl text-center font-bold text-base bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                    >
                      {t('no', 'No / नहीं')}
                    </button>
                  </div>
                )}

                {/* 4. SINGLE SELECT OPTIONS */}
                {currentQuestion.type === 'single_select' && currentQuestion.options && !optionsNeedTextInput && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((opt) => {
                      const optLabel = getLocalizedOption(opt, lang)
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectOption(opt.value)}
                          className="glass-card tile-lift w-full p-3.5 text-left border border-slate-200/80 bg-white hover:border-cobalt transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800"
                        >
                          <span>{optLabel}</span>
                          <span className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-cobalt group-hover:text-white">
                            <ArrowRight className="size-3.5" />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* 5. MULTI-SELECT OPTIONS */}
                {currentQuestion.type === 'multi_select' && currentQuestion.options && !optionsNeedTextInput && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((opt) => {
                      const optLabel = getLocalizedOption(opt, lang)
                      const isSelected = selectedOptions.includes(opt.value)
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectOption(opt.value)}
                          className={`glass-card tile-lift w-full p-3.5 text-left transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-semibold ${
                            isSelected
                              ? 'bg-cobalt-soft border-cobalt text-cobalt ring-1 ring-cobalt/30'
                              : 'border-slate-200/80 bg-white text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span>{optLabel}</span>
                          <span
                            className={`flex size-5 items-center justify-center rounded-md border ${
                              isSelected ? 'bg-cobalt border-cobalt text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <CheckSquare className="size-3.5" />}
                          </span>
                        </button>
                      )
                    })}
                    <div className="flex justify-end pt-3">
                      <Button
                        size="md"
                        onClick={handleSubmitCurrent}
                        disabled={selectedOptions.length === 0}
                        className="bg-cobalt text-white shadow-cobalt font-bold text-xs"
                      >
                        {t('confirm', 'Confirm Selections')} ({selectedOptions.length})
                      </Button>
                    </div>
                  </div>
                )}

                {optionsNeedTextInput && (
                  <div className="space-y-3">
                    <textarea rows={3} value={textInput} onChange={(event) => setTextInput(event.target.value)} placeholder={t('typeAnswer')} className="w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-[#174ea6]" />
                    <div className="flex justify-end"><Button size="md" onClick={handleSubmitCurrent} disabled={!textInput.trim()} className="bg-cobalt text-white font-bold text-xs">{t('submitAnswer')}</Button></div>
                  </div>
                )}

                {/* 6. NUMERIC KEYPAD */}
                {(currentQuestion.type === 'number' || currentQuestion.type === 'numeric_touch') && (
                  <div className="space-y-4">
                    <TouchNumericKeypad
                      value={numberInput}
                      onChange={setNumberInput}
                      onSubmit={handleSubmitCurrent}
                      label={questionText}
                      unit={currentQuestion.unit || ''}
                    />
                  </div>
                )}

                {/* 7. DATE PICKER */}
                {currentQuestion.type === 'date' && (
                  <div className="space-y-4">
                    <TouchDatePicker
                      value={dateValue}
                      onChange={setDateValue}
                      onSubmit={handleSubmitCurrent}
                    />
                  </div>
                )}

                {/* 8. FREE TEXT INPUT */}
                {currentQuestion.type === 'text' && (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t('typeAnswer')}
                      className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-cobalt"
                    />
                    <div className="flex justify-end">
                      <Button
                        size="md"
                        onClick={handleSubmitCurrent}
                        disabled={!textInput.trim()}
                        className="bg-cobalt text-white shadow-cobalt font-bold text-xs"
                      >
                        {t('submitAnswer')}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Controls Bar at bottom of card */}
                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={isSpeaking ? VolumeX : Volume2}
                      onClick={handleReadAloud}
                      className={isSpeaking ? 'text-cobalt bg-cobalt-soft text-xs' : 'text-xs text-slate-600'}
                    >
                      <span>{isSpeaking ? t('stopAudio', 'Stop') : t('readAloud', 'Listen')}</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={previousQuestion}
                      disabled={currentIndex === 0}
                      className="glass-pill px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
                    >
                      ← {t('back', 'Back')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        submitResponse(currentQuestion.id, '', null, 'skipped')
                        nextQuestion()
                      }}
                      className="glass-pill px-3 py-1.5 text-xs font-bold text-slate-400 border border-slate-200 cursor-pointer hover:text-slate-600"
                    >
                      {t('skip', 'Skip')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ── Right Column: Voice Assistant & Telemetry Panel (5 cols) ── */}
        <section className="space-y-4 flex flex-col justify-between">
          {/* Bionic Voice Assistant Card */}
          <div className="glass-card p-5 bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              {t('tapToSpeak', 'Tap to speak')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('voiceHelper', 'Speak naturally in your selected language.')}
            </p>

            {/* Pulsing Microphone Waveform Component */}
            <div className="my-4 w-full flex justify-center">
              <VoiceRecorder
                isListening={isListening}
                isSupported={isSupported}
                transcript={transcript}
                interimTranscript={interimTranscript}
                onStart={startListening}
                onStop={stopListening}
                error={error}
                className="w-full"
              />
            </div>

            {/* Voice Normalization Match Badge */}
            {voiceMatchStatus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-emerald-soft border border-emerald/30 text-emerald-900 p-2.5 rounded-xl text-left text-xs mb-3"
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="size-2 rounded-full bg-emerald animate-ping" />
                  <span>{t('confirm', 'Voice matched')}:</span>
                </div>
                <p className="mt-0.5 text-[11px] truncate">"{voiceMatchStatus.heard}" → {voiceMatchStatus.normalized}</p>
              </motion.div>
            )}

            {/* Conversational Voice AI Trigger Button */}
            {['en', 'hi'].includes(lang) && <button
              onClick={() => setShowConversationalModal(true)}
              className="w-full py-2.5 rounded-full bg-[#174ea6] text-white text-xs font-bold hover:bg-[#123b79] transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="size-4" />
              <span>{t('speakOrChoose', 'Start voice conversation')}</span>
            </button>}
          </div>
        </section>
      </div>

      {/* Inactivity Warning Countdown Modal */}
      <SessionTimeoutModal
        isOpen={isTimeoutWarning}
        secondsLeft={timeoutSecondsLeft}
        onStay={resetTimeout}
        onEndSession={handleEndSession}
      />

      {/* Explicit End Session Confirmation Modal */}
      <AnimatePresence>
        {showEndSessionConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-border-light"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <LogOut className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-text-primary text-lg font-heading mb-1.5">
                {t('endSession', 'End Kiosk Session?')}
              </h3>
              <p className="text-xs text-text-secondary mb-5">
                {t('endSessionConfirm', 'Are you sure you want to end this session? Unsaved responses will be cleared for patient privacy.')}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => setShowEndSessionConfirm(false)}
                >
                  {t('cancel')}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleEndSession}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {t('endSession')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Multilingual Conversational Voice AI Modal */}
      <ConversationalVoiceModal
        isOpen={showConversationalModal}
        onClose={() => setShowConversationalModal(false)}
        onApplyIntake={handleApplyConversationalIntake}
        lang={lang}
      />

      {/* Non-Diagnostic Red-Flag Clinical Safety Alert Modal */}
      <RedFlagAlertModal
        isOpen={isRedFlagOpen}
        alertData={activeRedFlag}
        lang={lang}
        onClose={() => {
          if (activeRedFlag) {
            setAcknowledgedRedFlags(prev => [...prev, activeRedFlag.id])
          }
        }}
        onAcknowledge={() => {
          if (activeRedFlag) {
            setAcknowledgedRedFlags(prev => [...prev, activeRedFlag.id])
          }
        }}
      />

      {/* Logical Contradiction Alert Modal */}
      {contradictionAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-amber-200 text-left space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="size-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  {contradictionAlert.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {contradictionAlert.message}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold">Why is this blocked?</p>
              <p className="text-amber-800 leading-normal">
                Clinical documentation requires consistency. If a surgery occurred, doctors need the approximate timeline or procedure. If no surgery occurred, please update the previous answer.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-end">
              <button
                type="button"
                onClick={handleResolveContradictionNoSurgery}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                <span>Change to "No Surgeries"</span>
              </button>
              <button
                type="button"
                onClick={() => setContradictionAlert(null)}
                className="px-4 py-2.5 rounded-xl bg-[#174ea6] hover:bg-[#123b79] text-xs font-bold text-white transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit3 className="size-3.5" />
                <span>Enter Surgery Details</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </BionicKioskShell>
  )
}
