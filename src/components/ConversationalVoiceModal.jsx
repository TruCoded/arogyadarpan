import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Check, X, Sparkles, AlertCircle, Volume2 } from 'lucide-react'
import Button from './Button'
import Badge from './Badge'
import { useVoiceInput } from '../hooks/useVoiceInput'
import { parseConversationalIntake } from '../services/conversationalAiEngine'

export default function ConversationalVoiceModal({
  isOpen,
  onClose,
  lang = 'en',
  onApplyIntake,
}) {
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
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [isOpen])

  // AI audio reply
  const handleSpeakAiReply = () => {
    if (!parsedResult?.conversationalReply || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(parsedResult.conversationalReply)
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.95
    utterance.onstart = () => setIsAiSpeaking(true)
    utterance.onend = () => setIsAiSpeaking(false)
    utterance.onerror = () => setIsAiSpeaking(false)
    window.speechSynthesis.speak(utterance)
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
        className="bg-surface-raised rounded-3xl border border-border-light shadow-2xl max-w-xl w-full p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-border-light pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-base font-heading">
                {lang === 'hi' ? 'प्राकृतिक बातचीत (बोलकर बताएं)' : 'Conversational Voice AI Intake'}
              </h3>
              <p className="text-xs text-text-muted">
                {lang === 'hi' ? 'हिंदी, अंग्रेजी या मिली-जुली भाषा में स्वाभाविक रूप से बोलें' : 'Speak naturally in Hindi, English, or mixed Hinglish'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Microphone Pulse & Status */}
        <div className="text-center py-5 bg-surface-muted rounded-2xl border border-border-light mb-4">
          <div className="relative inline-flex items-center justify-center mb-3">
            {/* Animated Pulsing Ring proportional to audioLevel */}
            {isListening && (
              <span
                className="absolute w-20 h-20 rounded-full bg-primary-400/30 animate-ping"
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
                  : 'bg-primary-500 text-white hover:bg-primary-600 ring-4 ring-primary-100'
                }
              `}
            >
              {isListening ? <Mic className="w-8 h-8 animate-pulse" /> : <MicOff className="w-8 h-8" />}
            </button>
          </div>

          <p className="font-bold text-text-primary text-sm mb-1">
            {isListening
              ? (lang === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak naturally')
              : (lang === 'hi' ? 'माइक बंद है — शुरू करने के लिए टैप करें' : 'Microphone paused — tap to start')
            }
          </p>
          <p className="text-xs text-text-muted italic px-4">
            "{lang === 'hi' ? 'उदा: पेट में दर्द है और कल से उल्टी भी हो रही है' : 'e.g. Pet mein pain hai aur kal se vomiting bhi ho rahi hai'}"
          </p>
        </div>

        {/* Live Speech Transcript */}
        <div className="bg-surface-raised border border-border-light rounded-xl p-3.5 mb-4 max-h-24 overflow-y-auto">
          <p className="text-xs font-bold text-text-muted uppercase mb-1">Live Transcript:</p>
          <p className="text-sm text-text-primary leading-relaxed font-medium">
            {currentText || interimTranscript ? (
              <>
                <span>{currentText}</span>
                {interimTranscript && <span className="text-text-muted italic"> {interimTranscript}</span>}
              </>
            ) : (
              <span className="text-text-muted italic">
                {lang === 'hi' ? 'आप जो बोलेंगे वह यहाँ दिखाई देगा...' : 'Your spoken words will appear here in real time...'}
              </span>
            )}
          </p>
        </div>

        {/* AI Extracted Clinical Entities */}
        {parsedResult && (
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                {lang === 'hi' ? 'एआई द्वारा पहचानी गई जानकारी' : 'AI Extracted Clinical Facts'}
              </span>
              <Badge severity="success" size="sm">
                Confidence: {Math.round((parsedResult.confidence || 0.9) * 100)}%
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Primary Complaint */}
              {parsedResult.primaryComplaint && (
                <div className="bg-primary-50/80 border border-primary-200 p-2.5 rounded-xl">
                  <span className="font-bold text-primary-900 block mb-0.5">Main Complaint:</span>
                  <span className="text-primary-800 font-semibold">{parsedResult.primaryComplaint.label}</span>
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
                    {parsedResult.associatedSymptoms.map(s => s.label).join(', ')}
                  </span>
                </div>
              )}

              {/* Extracted Diseases */}
              {parsedResult.diseases?.length > 0 && (
                <div className="col-span-2 bg-blue-50/80 border border-blue-200 p-2.5 rounded-xl">
                  <span className="font-bold text-blue-900 block mb-0.5">Reported Condition:</span>
                  <span className="text-blue-800 font-semibold">
                    {parsedResult.diseases.map(d => `${d.disease} (ICD-10 ${d.icd10})`).join(', ')}
                  </span>
                </div>
              )}

              {/* Extracted Medications */}
              {parsedResult.medications?.length > 0 && (
                <div className="col-span-2 bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-xl">
                  <span className="font-bold text-emerald-900 block mb-0.5">Medication & Dose:</span>
                  <span className="text-emerald-800 font-semibold">
                    {parsedResult.medications.map(m => `${m.medication} ${m.dose} — ${m.frequency}`).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* AI Conversational Response */}
            {parsedResult.conversationalReply && (
              <div className="bg-surface-muted border border-border-light p-3 rounded-xl flex items-start justify-between gap-3 text-xs">
                <p className="text-text-secondary leading-relaxed flex-1">
                  🤖 <span className="font-semibold text-text-primary">AI:</span> {parsedResult.conversationalReply}
                </p>
                <button
                  type="button"
                  onClick={handleSpeakAiReply}
                  className="text-primary-600 hover:text-primary-800 font-semibold flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Speak
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-light">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Check}
            disabled={!parsedResult?.primaryComplaint && !parsedResult?.duration && !parsedResult?.associatedSymptoms?.length}
            onClick={handleApply}
          >
            {lang === 'hi' ? 'लागू करें और आगे बढ़ें' : 'Apply Answers & Continue'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
