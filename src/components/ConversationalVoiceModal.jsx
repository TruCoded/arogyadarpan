import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Check, X, Sparkles, AlertCircle, Volume2, Radio } from 'lucide-react'
import Button from './Button'
import Badge from './Badge'
import { useVoiceInput } from '../hooks/useVoiceInput'
import { parseConversationalIntake } from '../services/conversationalAiEngine'
import { useLanguage } from '../context/LanguageContext'
import { playLanguageAudio, stopLanguageAudio } from '../services/audioTtsService'

export default function ConversationalVoiceModal({
  isOpen,
  onClose,
  lang = 'en',
  onApplyIntake,
}) {
  const { t, currentLanguageMeta } = useLanguage()
  const [currentText, setCurrentText] = useState('')
  const [parsedResult, setParsedResult] = useState(null)
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)

  const {
    isListening,
    transcript,
    interimTranscript,
    audioLevel,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    bhashiniMeta,
  } = useVoiceInput({
    lang,
    continuous: true,
    onResult: (finalText) => {
      const fullText = (currentText + ' ' + finalText).trim()
      setCurrentText(fullText)
    },
  })

  // Parse conversational text whenever transcript updates
  useEffect(() => {
    const textToParse = (currentText + ' ' + interimTranscript).trim()
    if (textToParse.length > 4) {
      const parsed = parseConversationalIntake(textToParse, lang)
      setParsedResult(parsed)
    }
  }, [currentText, interimTranscript, lang])

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentText('')
      setParsedResult(null)
      resetTranscript()
      startListening()
    } else {
      stopListening()
      stopLanguageAudio()
    }
  }, [isOpen])

  // AI audio reply
  const handleSpeakAiReply = () => {
    if (!parsedResult?.conversationalReply) return
    if (isAiSpeaking) {
      stopLanguageAudio()
      setIsAiSpeaking(false)
      return
    }
    setIsAiSpeaking(true)
    playLanguageAudio(
      parsedResult.conversationalReply,
      lang,
      () => setIsAiSpeaking(false),
      () => setIsAiSpeaking(false)
    )
  }

  const handleApply = () => {
    if (parsedResult) {
      onApplyIntake?.(parsedResult)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#174ea6] to-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base font-heading">
                  {t('conversationalAi', 'Conversational AI Voice Intake')}
                </h3>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#174ea6] border border-blue-200">
                  Bhashini / AI4Bharat
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t('voiceHelper', 'Speak naturally in your selected language.')} ({currentLanguageMeta?.native || 'English'})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Microphone Pulse & Status */}
        <div className="text-center py-5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-4">
          <div className="relative inline-flex items-center justify-center mb-3">
            {/* Animated Pulsing Ring proportional to audioLevel */}
            {isListening && (
              <span
                className="absolute w-20 h-20 rounded-full bg-blue-400/30 animate-ping"
                style={{ transform: `scale(${1 + audioLevel / 60})` }}
              />
            )}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`
                relative w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer
                ${isListening
                  ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white ring-4 ring-rose-200'
                  : 'bg-[#174ea6] text-white hover:bg-blue-700 ring-4 ring-blue-100'
                }
              `}
            >
              {isListening ? <Mic className="w-8 h-8 animate-pulse" /> : <MicOff className="w-8 h-8" />}
            </button>
          </div>

          <p className="font-bold text-slate-900 text-sm mb-1">
            {isListening
              ? t('listeningNow', 'Listening… Speak naturally in your language')
              : t('micPaused', 'Microphone paused — tap to speak')
            }
          </p>
          <p className="text-xs text-slate-500 italic px-4">
            "{t('exampleVoiceSymptom', 'e.g. I have severe chest pain since yesterday radiating to left arm')}"
          </p>
        </div>

        {/* Live Speech Transcript */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-4 max-h-24 overflow-y-auto shadow-inner">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Bhashini Live Transcript:
          </p>
          <p className="text-sm text-slate-900 leading-relaxed font-medium">
            {currentText || interimTranscript ? (
              <>
                <span>{currentText}</span>
                {interimTranscript && <span className="text-slate-400 italic"> {interimTranscript}</span>}
              </>
            ) : (
              <span className="text-slate-400 italic">
                {t('voicePlaceholder', 'Your spoken words will appear here in real time...')}
              </span>
            )}
          </p>
        </div>

        {/* AI Extracted Clinical Entities */}
        {parsedResult && (
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#174ea6]" />
                {t('aiExtractedFacts', 'AI Extracted Clinical Facts (Module C)')}
              </span>
              <Badge severity="success" size="sm">
                Confidence: {Math.round((parsedResult.confidence || 0.94) * 100)}%
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Primary Complaint */}
              {parsedResult.primaryComplaint && (
                <div className="bg-blue-50/80 border border-blue-200 p-2.5 rounded-xl">
                  <span className="font-bold text-blue-900 block mb-0.5">Chief Complaint:</span>
                  <span className="text-blue-800 font-semibold">{parsedResult.primaryComplaint.label}</span>
                </div>
              )}

              {/* Duration */}
              {parsedResult.duration && (
                <div className="bg-amber-50/80 border border-amber-200 p-2.5 rounded-xl">
                  <span className="font-bold text-amber-900 block mb-0.5">Duration:</span>
                  <span className="text-amber-800 font-semibold">{parsedResult.duration}</span>
                </div>
              )}

              {/* Associated Symptoms */}
              {parsedResult.associatedSymptoms?.length > 0 && (
                <div className="col-span-2 bg-purple-50/80 border border-purple-200 p-2.5 rounded-xl">
                  <span className="font-bold text-purple-900 block mb-0.5">Associated Symptoms:</span>
                  <span className="text-purple-800 font-semibold">
                    {parsedResult.associatedSymptoms.map((s) => s.label).join(', ')}
                  </span>
                </div>
              )}

              {/* Extracted Diseases */}
              {parsedResult.diseases?.length > 0 && (
                <div className="col-span-2 bg-blue-50/80 border border-blue-200 p-2.5 rounded-xl">
                  <span className="font-bold text-blue-900 block mb-0.5">Reported Condition:</span>
                  <span className="text-blue-800 font-semibold">
                    {parsedResult.diseases.map((d) => `${d.disease} (ICD-10 ${d.icd10})`).join(', ')}
                  </span>
                </div>
              )}

              {/* Extracted Medications */}
              {parsedResult.medications?.length > 0 && (
                <div className="col-span-2 bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-xl">
                  <span className="font-bold text-emerald-900 block mb-0.5">Medication & Dose:</span>
                  <span className="text-emerald-800 font-semibold">
                    {parsedResult.medications.map((m) => `${m.medication} ${m.dose} — ${m.frequency}`).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* AI Conversational Response */}
            {parsedResult.conversationalReply && (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start justify-between gap-3 text-xs">
                <p className="text-slate-700 leading-relaxed flex-1">
                  🤖 <span className="font-semibold text-slate-900">AI Response:</span> {parsedResult.conversationalReply}
                </p>
                <button
                  type="button"
                  onClick={handleSpeakAiReply}
                  className="text-[#174ea6] hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Speak
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Check}
            disabled={!parsedResult?.primaryComplaint && !parsedResult?.duration && !parsedResult?.associatedSymptoms?.length}
            onClick={handleApply}
          >
            {t('applyAnswers', 'Apply Answers & Continue')}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
