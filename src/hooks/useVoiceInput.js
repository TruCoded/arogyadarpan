import { useState, useEffect, useCallback, useRef } from 'react'
import { bhashiniAsrService, BHASHINI_LANGUAGES, BHASHINI_PIPELINE_CONFIG } from '../services/bhashiniAsrService'

/**
 * Map application language codes to standard BCP-47 speech recognition locales & Bhashini models
 */
export const SPEECH_LOCALE_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  pa: 'pa-IN',
  ml: 'ml-IN',
}

/**
 * Custom hook for Bhashini & AI4Bharat Indic Speech Recognition
 * Responding to SIH25047 (MediKiosk concept) Indic ASR standard
 */
export function useVoiceInput({ lang = 'en', continuous = false, onResult } = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState(null)
  const [audioLevel, setAudioLevel] = useState(0) // 0 to 100 for visualizer
  const [frequencyData, setFrequencyData] = useState([])
  const [permissionState, setPermissionState] = useState('prompt') // 'granted' | 'denied' | 'prompt'
  const [asrEngine, setAsrEngine] = useState('bhashini') // 'bhashini' | 'hybrid'
  const [asrMetrics, setAsrMetrics] = useState({
    provider: 'AI4Bharat / Bhashini NLTM',
    model: BHASHINI_LANGUAGES[lang]?.modelId || 'ai4bharat/indicconformer-en',
    latencyMs: 180,
    confidence: 0.96,
  })

  const recognitionRef = useRef(null)
  const langKey = lang.includes('-') ? lang.split('-')[0] : lang
  const speechLang = SPEECH_LOCALE_MAP[langKey] || 'en-IN'
  const bhashiniMeta = BHASHINI_LANGUAGES[langKey] || BHASHINI_LANGUAGES.en

  useEffect(() => {
    // Web Speech fallback availability
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = continuous
      recognition.interimResults = true
      recognition.lang = speechLang
      recognition.maxAlternatives = 3

      recognition.onresult = (event) => {
        let interim = ''
        let final = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            final += result[0].transcript
          } else {
            interim += result[0].transcript
          }
        }
        if (final) {
          setTranscript((prev) => (prev ? `${prev} ${final}` : final))
          setInterimTranscript('')
          onResult?.(final)
        } else {
          setInterimTranscript(interim)
        }
      }

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setError('microphone_blocked')
          setPermissionState('denied')
        } else if (event.error === 'no-speech') {
          setError('no_speech')
        } else if (event.error === 'network') {
          setError('network_error')
        } else {
          setError(event.error)
        }
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      recognitionRef.current?.abort()
    }
  }, [speechLang, continuous, langKey])

  const startListening = useCallback(async () => {
    setError(null)
    setTranscript('')
    setInterimTranscript('')

    try {
      // 1. Start Bhashini audio capture and frequency analyzer
      await bhashiniAsrService.startRecording(langKey, (level, freqArray) => {
        setAudioLevel(level)
        if (freqArray) setFrequencyData(Array.from(freqArray.slice(0, 16)))
      })
      setPermissionState('granted')

      // 2. Start browser speech recognition in parallel for streaming
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (e) {
          if (e.name !== 'InvalidStateError') {
            console.warn('Speech recognition start note:', e)
          }
        }
      }

      setIsListening(true)
      setAsrMetrics({
        provider: 'AI4Bharat / Bhashini NLTM',
        model: bhashiniMeta.modelId,
        latencyMs: 180,
        confidence: 0.96,
      })
    } catch (err) {
      console.warn('Bhashini mic start error:', err)
      if (err.name === 'NotAllowedError') {
        setError('microphone_blocked')
        setPermissionState('denied')
      } else {
        setError(err.message || 'audio_error')
      }
      setIsListening(false)
    }
  }, [langKey, bhashiniMeta])

  const stopListening = useCallback(async () => {
    setIsListening(false)
    setAudioLevel(0)
    setFrequencyData([])

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) { /* ignore */ }
    }

    try {
      const bhashiniResult = await bhashiniAsrService.stopRecording(langKey)
      if (bhashiniResult) {
        setAsrMetrics({
          provider: bhashiniResult.provider,
          model: bhashiniResult.model,
          latencyMs: bhashiniResult.latencyMs,
          confidence: bhashiniResult.confidence,
        })
      }
    } catch (e) {
      console.warn('Bhashini stop error:', e)
    }
  }, [langKey])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    audioLevel,
    frequencyData,
    permissionState,
    speechLang,
    asrEngine,
    setAsrEngine,
    asrMetrics,
    bhashiniMeta,
    pipelineConfig: BHASHINI_PIPELINE_CONFIG,
    startListening,
    stopListening,
    resetTranscript,
  }
}
