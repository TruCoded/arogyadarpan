import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Volume2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import StitchAppHeader from '../../components/StitchAppHeader'

export default function LanguageSelection() {
  const { lang: selected, setLanguage, languages, t } = useLanguage()
  const navigate = useNavigate()
  const [playingLang, setPlayingLang] = useState(null)

  const handleAudioPreview = (e, langItem) => {
    e.stopPropagation()
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    setPlayingLang(langItem.id)

    const greetings = {
      hi: 'नमस्ते! आप आरोग्यदर्पण में हिंदी में बोल सकते हैं।',
      en: 'Hello! You can speak and read in English in ArogyaDarpan.',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਆਰੋਗਿਆਦਰਪਣ ਵਿੱਚ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ।',
      bn: 'নমস্কার! আপনি আরোগ্যদর্পণে বাংলায় কথা বলতে পারেন।',
      mr: 'नमस्कार! आपण आरोग्यदर्पणात मराठीत बोलू शकता.',
      gu: 'નમસ્તે! તમે આરોગ્યદર્પણમાં ગુજરાતીમાં વાત કરી શકો છો.',
      ta: 'வணக்கம்! நீங்கள் ஆரோக்கியதர்பனில் தமிழில் பேசலாம்.',
      te: 'నమస్కారం! మీరు ఆరోగ్యదర్పణ్‌లో తెలుగులో మాట్లాడవచ్చు.',
      kn: 'ನಮಸ್ಕಾರ! ನೀವು ಆರೋಗ್ಯದರ್ಪಣದಲ್ಲಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಹುದು.',
      ml: 'നമസ്കാരം! നിങ്ങൾക്ക് ആരോഗ്യദർപ്പണിൽ മലയാളത്തിൽ സംസാരിക്കാം.'
    }

    const utterance = new SpeechSynthesisUtterance(greetings[langItem.id] || greetings.en)
    utterance.lang = langItem.speechLocale || 'en-IN'
    utterance.rate = 0.95
    utterance.onend = () => setPlayingLang(null)
    utterance.onerror = () => setPlayingLang(null)
    window.speechSynthesis.speak(utterance)
  }

  const handleContinue = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    navigate('/patient/consent')
  }

  const previewQuotes = {
    hi: '“नमस्ते! आप हिन्दी में बोल सकते हैं।”',
    en: '“Hello! You can consult in English.”',
    pa: '“ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ।”',
    bn: '“নমস্কার! আপনি বাংলায় কথা বলতে পারেন।”',
    mr: '“नमस्कार! आपण मराठीत बोलू शकता.”',
    gu: '“નમસ્તે! તમે ગુજરાતીમાં વાત કરી શકો છો.”',
    ta: '“வணக்கம்! நீங்கள் தமிழில் பேசலாம்.”',
    te: '“నమస్కారం! మీరు తెలుగులో మాట్లాడవచ్చు.”',
    kn: '“ನಮಸ್ಕಾರ! ನೀವು ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಹುದು.”',
    ml: '“നമസ്കാരം! നിങ്ങൾക്ക് മലയാളത്തിൽ സംസാരിക്കാം.”'
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900 flex flex-col select-none">
      <StitchAppHeader title="भाषा चयन (Language Selection)" showBack onBack={() => navigate('/')} />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Progress Header */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-teal-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              Step 1 of 6 • भाषा चयन
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">15% COMPLETE</span>
          </div>

          {/* Title and subtext */}
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t('chooseLanguage', 'Choose your preferred language')}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {t('canChangeLang', 'You can speak and read in this language throughout your consultation.')}
            </p>
          </div>

          {/* Clinical Voice Wave Banner for Selected Language */}
          <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-teal-500/20 backdrop-blur-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-teal-700 shrink-0">
                <Volume2 className="size-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[10px] text-teal-700 uppercase font-bold tracking-wider">Voice Preview • पूर्वावलोकन</span>
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {previewQuotes[selected] || previewQuotes.en}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                const cur = languages.find(l => l.id === selected) || languages[0]
                handleAudioPreview(e, cur)
              }}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 border border-teal-200 cursor-pointer"
            >
              <Volume2 className="size-3.5 text-teal-600" />
              <span>सुनें / Listen</span>
            </button>
          </div>

          {/* 2-Column Tactile Grid matching Stitch design */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {languages.map((langItem, i) => {
              const isSelected = selected === langItem.id
              const isPlaying = playingLang === langItem.id

              return (
                <motion.div
                  key={langItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <div
                    onClick={() => setLanguage(langItem.id)}
                    className={`p-3 sm:p-4 rounded-2xl flex flex-col justify-between min-h-[124px] sm:min-h-[140px] cursor-pointer transition-all border relative ${
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-500/30 bg-teal-500/8 shadow-sm'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl sm:text-3xl flex-shrink-0">{langItem.flag}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleAudioPreview(e, langItem)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                            isPlaying
                              ? 'bg-teal-600 text-white animate-pulse'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title="सुनें / Listen"
                          aria-label={`Listen in ${langItem.label}`}
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                        {isSelected && (
                          <div className="size-5 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-xs">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 min-w-0">
                      <p className="font-bold text-slate-900 text-sm sm:text-base font-heading leading-tight truncate">
                        {langItem.native}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                        {langItem.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom Floating CTA Bar */}
        <div className="sticky bottom-0 pt-4 pb-safe bg-gradient-to-t from-[#f7f9fb] via-[#f7f9fb]/95 to-transparent z-20">
          <button
            onClick={handleContinue}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-heading font-bold text-sm sm:text-base shadow-teal-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('continue', 'Continue in')} {languages.find(l => l.id === selected)?.native || 'English'}</span>
            <ArrowRight className="size-4 sm:size-5" />
          </button>
        </div>
      </main>
    </div>
  )
}
