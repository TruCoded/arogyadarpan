import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  getQuestionSequence,
  getAYUSHQuestionSequence,
  COMPLETENESS_CATEGORIES,
  evaluateAdaptiveQuestions
} from '../data/questionBank'
import { calculateClinicalTriage } from '../services/triageEngine'
import {
  saveActiveInterviewState,
  getActiveInterviewState,
  getActiveResponses,
  clearPatientSession
} from '../services/sessionStore'

export function useInterview(initialComplaint = null) {
  // Restore saved interview state if present
  const savedState = useMemo(() => getActiveInterviewState(), [])
  const savedResponses = useMemo(() => getActiveResponses(), [])

  const [selectedComplaint, setSelectedComplaint] = useState(
    savedState?.selectedComplaint || initialComplaint || null
  )
  const [currentIndex, setCurrentIndex] = useState(savedState?.currentIndex || 0)
  const [responses, setResponses] = useState(
    savedState?.responses || (savedResponses.length > 0 ? savedResponses : [])
  )
  const [isComplete, setIsComplete] = useState(savedState?.isComplete || false)
  const [mode, setModeState] = useState(savedState?.mode || 'modern') // 'modern' | 'ayush'
  const [isLowLiteracy, setIsLowLiteracy] = useState(false)

  const setMode = useCallback((newMode) => {
    setModeState(newMode)
    setCurrentIndex(0) // Switch cleanly to question 1 of the chosen track
  }, [])

  // Calculate live clinical triage analysis from current responses
  const triageData = useMemo(() => {
    return calculateClinicalTriage({ responses })
  }, [responses])

  // Build question sequence based on selected complaint, mode, and dynamic triage insights
  const questions = useMemo(() => {
    let base = mode === 'ayush'
      ? getAYUSHQuestionSequence(selectedComplaint || 'chest_pain')
      : getQuestionSequence(selectedComplaint || 'chest_pain')

    // Inject dynamic follow-up questions if discovered by triage engine and not already in sequence
    if (triageData.dynamicQuestions && triageData.dynamicQuestions.length > 0) {
      triageData.dynamicQuestions.forEach(dq => {
        if (!base.some(q => q.id === dq.id)) {
          const insertIdx = base.findIndex(q => q.id === 'ros_systems')
          if (insertIdx >= 0) {
            base.splice(insertIdx, 0, dq)
          } else {
            base.push(dq)
          }
        }
      })
    }

    // Dynamic Clinical Decision Tree: Inject adaptive follow-up branching questions
    const adaptiveFollowUps = evaluateAdaptiveQuestions(responses)
    adaptiveFollowUps.forEach(aq => {
      if (!base.some(q => q.id === aq.id)) {
        const triggerIdx = base.findIndex(q => q.id === aq.dependsOn?.questionId)
        if (triggerIdx >= 0) {
          base.splice(triggerIdx + 1, 0, aq)
        } else {
          base.push(aq)
        }
      }
    })

    return base
  }, [selectedComplaint, mode, triageData.dynamicQuestions, responses])

  // Real-time auto-saving of interview progress to sessionStore
  useEffect(() => {
    saveActiveInterviewState({
      currentIndex,
      responses,
      selectedComplaint,
      mode,
      isComplete,
    })
    // Also keep arogyadarpan responses updated in storage
    if (responses.length > 0) {
      try {
        localStorage.setItem('arogya_responses', JSON.stringify(responses))
      } catch (e) {
        console.warn('Storage error:', e)
      }
    }
  }, [currentIndex, responses, selectedComplaint, mode, isComplete])

  const currentQuestion = questions[currentIndex] || null
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? Math.round((currentIndex / totalQuestions) * 100) : 0

  const completeness = useMemo(() => {
    return COMPLETENESS_CATEGORIES.map(cat => {
      const categoryQuestions = questions.filter(q => q.category === cat.id)
      const answeredInCategory = categoryQuestions.filter(q =>
        responses.some(r => r.questionId === q.id && r.structuredValue !== null && r.structuredValue !== '')
      )

      let status = 'not_collected'
      if (answeredInCategory.length === categoryQuestions.length && categoryQuestions.length > 0) {
        status = 'collected'
      } else if (answeredInCategory.length > 0) {
        status = 'needs_clarification'
      }

      return { ...cat, status }
    })
  }, [responses, questions])

  const completenessPercent = useMemo(() => {
    const collected = completeness.filter(c => c.status === 'collected').length
    const partial = completeness.filter(c => c.status === 'needs_clarification').length
    return Math.round(((collected + partial * 0.5) / completeness.length) * 100)
  }, [completeness])

  const submitResponse = useCallback((questionId, originalResponse, structuredValue, inputMethod = 'touch') => {
    const response = {
      questionId,
      question: currentQuestion?.question || '',
      originalResponse: originalResponse || '',
      structuredValue,
      inputMethod,
      confidence: inputMethod === 'touch' ? 1.0 : 0.92,
      answeredAt: new Date().toISOString(),
    }

    setResponses(prev => {
      const existing = prev.findIndex(r => r.questionId === questionId)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = response
        return updated
      }
      return [...prev, response]
    })

    if (questionId === 'chief_complaint' && structuredValue) {
      setSelectedComplaint(structuredValue)
    }
  }, [currentQuestion])

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, questions.length])

  const previousQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  const jumpToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
    }
  }, [questions.length])

  const resetInterview = useCallback(() => {
    clearPatientSession()
    setCurrentIndex(0)
    setResponses([])
    setSelectedComplaint(null)
    setIsComplete(false)
  }, [])

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    progress,
    questions,
    responses,
    selectedComplaint,
    setSelectedComplaint,
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
    jumpToQuestion,
    resetInterview,
  }
}
