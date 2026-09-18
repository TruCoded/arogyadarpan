import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Volume2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import StitchAppHeader from '../../components/StitchAppHeader'

const GREETINGS = {
  en: 'Hello. You can use ArogyaDarpan in English.',
  hi: 'नमस्ते। आप आरोग्यदर्पण का उपयोग हिन्दी में कर सकते हैं।',
  bn: 'নমস্কার। আপনি বাংলায় আরোগ্যদর্পণ ব্যবহার করতে পারেন।',
  ta: 'வணக்கம். நீங்கள் ஆரோக்யதர்பனை தமிழில் பயன்படுத்தலாம்.',
  te: 'నమస్కారం. మీరు ఆరోగ్యదర్పణ్‌ను తెలుగులో ఉపయోగించవచ్చు.',
  mr: 'नमस्कार. तुम्ही आरोग्यदर्पण मराठीत वापरू शकता.',
  gu: 'નમસ્તે. તમે આરોગ્યદર્પણનો ગુજરાતીમાં ઉપયોગ કરી શકો છો.',
  kn: 'ನಮಸ್ಕಾರ. ನೀವು ಆರೋಗ್ಯದರ್ಪಣವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಬಳಸಬಹುದು.',
  pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਸੀਂ ਆਰੋਗਿਆਦਰਪਣ ਨੂੰ ਪੰਜਾਬੀ ਵਿੱਚ ਵਰਤ ਸਕਦੇ ਹੋ।',
  ml: 'നമസ്കാരം. നിങ്ങൾക്ക് ആരോഗ്യദർപ്പൺ മലയാളത്തിൽ ഉപയോഗിക്കാം.',
}

export default function LanguageSelection() {
  const { lang, setLanguage, languages, t } = useLanguage()
  const navigate = useNavigate()
  const [speaking, setSpeaking] = useState(null)

  const preview = (event, item) => {
    event.stopPropagation()
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const speech = new SpeechSynthesisUtterance(GREETINGS[item.id] || GREETINGS.en)
    speech.lang = item.speechLocale
    speech.rate = 0.9
    speech.onend = () => setSpeaking(null)
    speech.onerror = () => setSpeaking(null)
    setSpeaking(item.id)
    window.speechSynthesis.speak(speech)
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <StitchAppHeader title={t('switchLanguage', 'Language')} showBack onBack={() => navigate('/')} />

      <main className="mx-auto w-full max-w-3xl px-5 pb-28 pt-8 sm:px-8">
        <div className="mb-7">
          <p className="mb-2 text-sm font-semibold text-[#174ea6]">1 / 4</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('chooseLanguage', 'Choose your language')}
          </h1>
          <p className="mt-2 max-w-xl text-base text-slate-600">
            {t('canChangeLang', 'You can change your language anytime.')}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {languages.map((item, index) => {
            const selected = item.id === lang
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLanguage(item.id)}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left transition sm:px-5 ${
                  index ? 'border-t border-slate-200' : ''
                } ${selected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
              >
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${selected ? 'bg-[#174ea6] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {item.native.slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-slate-950">{item.native}</span>
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => preview(event, item)}
                  onKeyDown={(event) => event.key === 'Enter' && preview(event, item)}
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${speaking === item.id ? 'bg-[#174ea6] text-white' : 'text-[#174ea6] hover:bg-blue-50'}`}
                  aria-label={t('readAloud')}
                >
                  <Volume2 className="size-5" />
                </span>
                {selected && <Check className="size-5 shrink-0 text-[#174ea6]" />}
              </button>
            )
          })}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate('/patient/consent')}
          className="mx-auto flex w-full max-w-2xl items-center justify-center gap-2 rounded-full bg-[#174ea6] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#123b79] active:scale-[0.99]"
        >
          {t('continue', 'Continue')}
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  )
}
