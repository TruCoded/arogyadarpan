import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Clock, XCircle, CheckCircle } from 'lucide-react'
import Button from './Button'
import { useLanguage } from '../context/LanguageContext'

/**
 * SessionTimeoutModal — Inactivity warning countdown modal for public kiosks
 */
export default function SessionTimeoutModal({
  isOpen,
  secondsLeft,
  onStay,
  onEndSession,
}) {
  const { t } = useLanguage()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-200 text-center relative overflow-hidden"
        >
          {/* Top pulse indicator */}
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-text-primary font-heading mb-2">
            {t('sessionTimeoutTitle', 'Are you still there?')}
          </h3>

          <p className="text-sm text-text-secondary mb-6">
            {t('sessionTimeoutSub', 'Your kiosk session will reset due to inactivity in:')}
          </p>

          {/* Animated Countdown Circle */}
          <div className="w-24 h-24 rounded-full border-4 border-amber-500 bg-amber-50 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <span className="text-4xl font-extrabold text-amber-600 font-heading">
              {secondsLeft}s
            </span>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onStay}
              icon={CheckCircle}
              className="shadow-lg shadow-primary-500/25"
            >
              {t('stayLoggedIn', "I'm still here")}
            </Button>

            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={onEndSession}
              icon={XCircle}
              className="text-text-muted hover:text-critical"
            >
              {t('endSession', 'End Session Now')}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
