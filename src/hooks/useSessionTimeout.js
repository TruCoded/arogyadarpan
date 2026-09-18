import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useSessionTimeout — Inactivity timeout hook for public OPD Kiosks
 * Protects patient privacy by auto-resetting the session if idle.
 *
 * @param {Object} options
 * @param {number} options.idleMinutes - Minutes of inactivity before session resets (default: 3)
 * @param {number} options.warningSeconds - Warning countdown duration (default: 30)
 * @param {Function} options.onTimeout - Callback when session expires
 * @param {boolean} options.enabled - Whether the timeout tracker is active
 */
export function useSessionTimeout({
  idleMinutes = 3,
  warningSeconds = 30,
  onTimeout,
  enabled = true
} = {}) {
  const [isWarning, setIsWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(warningSeconds)

  const timeoutTimerRef = useRef(null)
  const warningTimerRef = useRef(null)
  const countdownIntervalRef = useRef(null)

  const totalIdleMs = idleMinutes * 60 * 1000
  const warningMs = totalIdleMs - (warningSeconds * 1000)

  const clearAllTimers = useCallback(() => {
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current)
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
  }, [])

  const resetTimeout = useCallback(() => {
    if (!enabled) return

    clearAllTimers()
    setIsWarning(false)
    setSecondsLeft(warningSeconds)

    // Trigger warning countdown modal
    warningTimerRef.current = setTimeout(() => {
      setIsWarning(true)
      setSecondsLeft(warningSeconds)

      countdownIntervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, Math.max(1000, warningMs))

    // Trigger final session timeout expiration
    timeoutTimerRef.current = setTimeout(() => {
      clearAllTimers()
      setIsWarning(false)
      if (onTimeout) onTimeout()
    }, totalIdleMs)
  }, [enabled, clearAllTimers, warningMs, totalIdleMs, warningSeconds, onTimeout])

  useEffect(() => {
    if (!enabled) {
      clearAllTimers()
      return
    }

    const events = ['mousedown', 'mousemove', 'touchstart', 'touchmove', 'keydown', 'scroll']
    const handleActivity = () => {
      if (!isWarning) {
        resetTimeout()
      }
    }

    events.forEach(evt => window.addEventListener(evt, handleActivity, { passive: true }))
    resetTimeout()

    return () => {
      clearAllTimers()
      events.forEach(evt => window.removeEventListener(evt, handleActivity))
    }
  }, [enabled, isWarning, resetTimeout, clearAllTimers])

  return {
    isWarning,
    secondsLeft,
    resetTimeout
  }
}
