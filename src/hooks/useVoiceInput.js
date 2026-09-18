import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Map application language codes to standard BCP-47 speech recognition locales
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
 * Custom hook for Web Speech API voice input with audio level analysis & microphone management
 * Works on Chrome/Edge — gracefully degrades in unsupported environments
 */
export function useVoiceInput({ lang = 'en-IN', continuous = false, onResult } = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState(null)
  const [audioLevel, setAudioLevel] = useState(0) // 0 to 100 for visualizer
  const [permissionState, setPermissionState] = useState('prompt') // 'granted' | 'denied' | 'prompt'

  const recognitionRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animFrameRef = useRef(null)
  const streamRef = useRef(null)

  // Map language to proper BCP-47 speech locale
  const speechLang = SPEECH_LOCALE_MAP[lang] || lang || 'en-IN'

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
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
          setTranscript(prev => prev ? `${prev} ${final}` : final)
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
          // Noise/silence handling: graceful recovery
          setError('no_speech')
        } else if (event.error === 'network') {
          setError('network_error')
        } else {
          setError(event.error)
        }
        setIsListening(false)
        stopAudioLevelAnalysis()
      }

      recognition.onend = () => {
        setIsListening(false)
        stopAudioLevelAnalysis()
      }

      recognitionRef.current = recognition
    }

    return () => {
      recognitionRef.current?.abort()
      stopAudioLevelAnalysis()
    }
  }, [speechLang, continuous])

  // Start Web Audio API Analyser for real-time microphone volume visualization
  const startAudioLevelAnalysis = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setPermissionState('granted')

      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return

      const ctx = new AudioCtx()
      audioContextRef.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      analyserRef.current = analyser

      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateLevel = () => {
        if (!analyserRef.current) return
        analyserRef.current.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i]
        }
        const avg = sum / bufferLength
        // Normalize roughly to 0-100
        const level = Math.min(100, Math.round((avg / 128) * 100))
        setAudioLevel(level)
        animFrameRef.current = requestAnimationFrame(updateLevel)
      }
      updateLevel()
    } catch (err) {
      console.warn('Microphone audio analyser unavailable:', err)
    }
  }

  const stopAudioLevelAnalysis = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    setAudioLevel(0)
  }

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) return
    setError(null)
    setTranscript('')
    setInterimTranscript('')
    try {
      await startAudioLevelAnalysis()
      recognitionRef.current.start()
      setIsListening(true)
    } catch (e) {
      // If already started, ignore
      if (e.name !== 'InvalidStateError') {
        console.warn('SpeechRecognition start error:', e)
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) { /* ignore */ }
    }
    stopAudioLevelAnalysis()
    setIsListening(false)
  }, [])

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
    permissionState,
    speechLang,
    startListening,
    stopListening,
    resetTranscript,
  }
}
