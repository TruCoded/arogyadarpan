import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSelector({ variant = 'compact', className = '' }) {
  const { lang, setLanguage, languages, currentLanguageMeta } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {languages.map((l) => {
          const isActive = l.id === lang
          return (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm ${
                isActive
                  ? 'bg-primary-600 text-white shadow-primary-500/20'
                  : 'bg-surface border border-border-light text-text-secondary hover:text-text-primary hover:border-primary-300'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.native}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/90 hover:bg-surface border border-border-light text-text-primary text-xs font-semibold shadow-sm transition-all hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-primary-600" />
        <span>{currentLanguageMeta.flag} {currentLanguageMeta.native}</span>
        <ChevronDown className={`w-3 h-3 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-56 rounded-2xl bg-surface-raised border border-border-light shadow-xl py-2 backdrop-blur-md"
          >
            <div className="px-3 py-1.5 border-b border-border-light/60 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Select Language / भाषा चुनें</p>
            </div>
            <div className="max-h-64 overflow-y-auto px-1 space-y-0.5 custom-scrollbar">
              {languages.map((l) => {
                const isSelected = l.id === lang
                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLanguage(l.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-primary-50 text-primary-700 font-bold'
                        : 'text-text-primary hover:bg-surface-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{l.flag}</span>
                      <div>
                        <p className="leading-tight">{l.native}</p>
                        <p className="text-[10px] text-text-muted font-normal">{l.label} • {l.region}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary-600 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
