import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Volume2,
  Lock,
  ArrowRight,
  Check,
  Sparkles,
  FileText,
  CheckCircle2,
  Pause,
  Play,
  FileLock2,
  BookOpen
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import StitchAppHeader from '../../components/StitchAppHeader'

export default function ConsentScreen() {
  const [agreed, setAgreed] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioSeconds, setAudioSeconds] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const audioIntervalRef = useRef(null)
  const navigate = useNavigate()
  const { lang, t, speechLocale } = useLanguage()

  const [consentOptions, setConsentOptions] = useState({
    historyCollection: true,
    documentOCR: true,
    abdmSync: true,
  })

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current)
      }
    }
  }, [])

  const toggleAudioNarration = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      clearInterval(audioIntervalRef.current)
      setIsPlayingAudio(false)
    } else {
      setIsPlayingAudio(true)
      const consentNarrations = {
        hi: 'नमस्ते। आपका स्वास्थ्य डेटा पूरी तरह सुरक्षित है। आरोग्यदर्पण आपकी समस्या और लक्षणों को डॉक्टर के लिए तैयार करता है। अंतिम निर्णय और दवा का अधिकार केवल आपके डॉक्टर का है।',
        pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਹਾਡਾ ਸਿਹਤ ਡਾਟਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਹੈ। ਆਰੋਗਿਆਦਰਪਣ ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਨੂੰ ਡਾਕਟਰ ਲਈ ਤਿਆਰ ਕਰਦਾ ਹੈ। ਅੰਤਿਮ ਫੈਸਲਾ ਅਤੇ ਦਵਾਈ ਤੁਹਾਡੇ ਡਾਕਟਰ ਦੁਆਰਾ ਦਿੱਤੀ ਜਾਵੇਗੀ।',
        bn: 'নমস্কার। আপনার স্বাস্থ্য তথ্য সম্পূর্ণ সুরক্ষিত। আরোগ্যদর্পণ আপনার লক্ষণসমূহ ডাক্তারের জন্য প্রস্তুত করে। চূড়ান্ত সিদ্ধান্ত আপনার চিকিৎসকের।',
        ta: 'வணக்கம். உங்கள் சுகாதாரத் தகவல் முற்றிலும் பாதுகாப்பானது. ஆரோக்கியதர்பன் உங்கள் அறிகுறிகளை மருத்துவருக்காகத் தயார் செய்கிறது. இறுதி முடிவு மருத்துவரே எடுப்பார்.',
        te: 'నమస్కారం. మీ ఆరోగ్య సమాచారం పూర్తిగా సురక్షితం. ఆరోగ్యదర్పణ్ మీ లక్షణాలను వైద్యుని కోసం సిద్ధం చేస్తుంది. తుది నిర్ణయం వైద్యుడిదే.',
        mr: 'नमस्कार. तुमचा आरोग्य डेटा पूर्णपणे सुरक्षित आहे. आरोग्यदर्पण तुमची लक्षणे डॉक्टरांसाठी तयार करते. अंतिम निर्णय डॉक्टरांचा असेल.',
        gu: 'નમસ્તે. તમારો આરોગ્ય ડેટા સંપૂર્ણપણે સુરક્ષિત છે. આરોગ્યદર્પણ તમારા લક્ષણો ડોક્ટર માટે તૈયાર કરે છે. અંતિમ નિર્ણય ડોક્ટરનો રહેશે.',
        kn: 'ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಮಾಹಿತಿ ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿದೆ. ಆರೋಗ್ಯದರ್ಪಣ ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವೈದ್ಯರಿಗಾಗಿ ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.',
        ml: 'നമസ്കാരം. നിങ്ങളുടെ ആരോഗ്യ വിവരങ്ങൾ പൂർണ്ണമായും സുരക്ഷിതമാണ്. ആരോഗ്യദർപ്പൺ രോഗലക്ഷണങ്ങൾ ഡോക്ടർക്കായി തയ്യാറാക്കുന്നു.',
        en: 'Hello. Your health data remains completely secure. ArogyaDarpan structures your symptoms for the consulting physician. 100% of final diagnosis and prescription rests solely with your doctor.'
      }

      const textToSpeak = consentNarrations[lang] || consentNarrations.en

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.rate = 0.95
        utterance.lang = speechLocale || 'en-IN'
        utterance.onend = () => {
          setIsPlayingAudio(false)
          clearInterval(audioIntervalRef.current)
          setAudioSeconds(64)
        }
        utterance.onerror = () => {
          setIsPlayingAudio(false)
          clearInterval(audioIntervalRef.current)
        }
        window.speechSynthesis.speak(utterance)
      }

      audioIntervalRef.current = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= 64) {
            clearInterval(audioIntervalRef.current)
            setIsPlayingAudio(false)
            return 64
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  const handleContinue = () => {
    if (!agreed || isSubmitting) return
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()

    setIsSubmitting(true)
    localStorage.setItem(
      'arogya_consent',
      JSON.stringify({
        grantedAt: new Date().toISOString(),
        dpdpCompliant: true,
        options: consentOptions,
      })
    )

    setTimeout(() => {
      navigate('/patient')
    }, 600)
  }

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0')
    const s = String(secs % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900 flex flex-col select-none">
      <StitchAppHeader title="सहमति पत्र (Digital Consent)" showBack onBack={() => navigate('/patient/language')} />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 pb-36"
        >
          {/* Progress Header */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-teal-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              Step 2 of 6 • सहमति पत्र (Consent)
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">33% COMPLETE</span>
          </div>

          {/* Title and Subtitle */}
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t('consentTitle', 'Your Health Data Stays In Your Hands')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {t('consentSubtitle', 'आपका स्वास्थ्य, आपका नियंत्रण — Complete clinical transparency before we record intake symptoms.')}
            </p>
          </div>

          {/* Interactive Audio Consent Bar */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs border border-teal-500/20">
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center shrink-0">
                    <Volume2 className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate">
                      {lang === 'hi' ? 'सहमति बोलकर सुनें' : 'Listen in Hindi / सहमति बोलकर सुनें'}
                    </span>
                    <span className="text-[11px] text-slate-500">1 min guided voice walkthrough</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleAudioNarration}
                  className={`h-9 px-3.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 shadow-2xs shrink-0 cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="size-3.5" /> : <Play className="size-3.5 fill-current" />}
                  <span>{isPlayingAudio ? 'PAUSE' : 'PLAY'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                {/* Audio Wave Bars */}
                <div className="flex items-center gap-1 h-5 px-2 rounded-full bg-slate-100">
                  {[4, 8, 14, 8, 4].map((height, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-teal-600 animate-pulse' : 'bg-slate-400 opacity-60'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(4, (height * (audioSeconds % 3 + 1)) % 18)}px` : `${height}px`,
                      }}
                    />
                  ))}
                </div>

                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isPlayingAudio ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
                  {isPlayingAudio ? 'Speaking...' : 'Ready for Audio'}
                </span>

                <span className="font-mono text-xs font-semibold text-slate-700">
                  {formatTime(audioSeconds)} / 01:04
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-200"
                  style={{ width: `${Math.min(100, (audioSeconds / 64) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3 Empathetic Clinical Trust Cards */}
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">AI Prepares, Human Doctor Decides</h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 shrink-0">
                    ASSISTIVE ONLY
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  ArogyaDarpan structures your chief complaints, past visits, and timeline. 100% of diagnoses and prescriptions remain solely with your registered doctor.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">ABDM & Ayushman Bharat Standard</h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                    256-BIT ENCRYPTED
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Every data packet complies strictly with National Health Authority protocols. Your health record links safely with zero commercial data brokers.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">Edit, Redact, or Delete Anytime</h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 shrink-0">
                    PATIENT CONTROL
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  You maintain total sovereign ownership. Review, edit, or purge any voice clip, transcribed term, or vitals reading before final push to the clinic console.
                </p>
              </div>
            </div>
          </div>

          {/* Consultation Recipient Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Consultation Recipient
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="size-3" />
                Verified Practitioner
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-700/10 border-2 border-teal-600/30 flex items-center justify-center text-xl shrink-0">
                🩺
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-900 text-sm truncate">Dr. Ananya Sharma, MD</span>
                <span className="text-xs text-slate-600 truncate">Internal Medicine • Safdarjung OPD Unit 4</span>
              </div>
            </div>
          </div>

          {/* Primary Agreement Toggle */}
          <div
            onClick={() => setAgreed(!agreed)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 select-none ${
              agreed
                ? 'border-teal-600 bg-teal-500/5 shadow-xs'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          >
            <div
              className={`size-6 rounded-lg shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                agreed ? 'bg-teal-600 text-white' : 'border-2 border-slate-300'
              }`}
            >
              {agreed && <Check className="size-4 stroke-[3]" />}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                I understand and consent to share my structured intake summary with Dr. Ananya Sharma for today’s OPD consultation.
              </p>
              <p className="text-xs text-slate-500">
                मैं समझता/समझती हूँ और परामर्श हेतु जानकारी साझा करने की अनुमति देता/देती हूँ।
              </p>
            </div>
          </div>

          {/* Read Full Charter Link */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => alert('ABDM Patient Charter: You retain full consent management, right to revoke access, data confidentiality under Section 4 of DPDP Act.')}
              className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="size-3.5" />
              <span>Read Full ABDM Privacy Charter & Patient Rights</span>
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <FileLock2 className="size-3.5 text-emerald-600" />
              <span>Governed by Digital Personal Data Protection (DPDP) Act 2023</span>
            </div>
          </div>
        </motion.div>

        {/* Sticky Floating CTA with Safe-Area Padding */}
        <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto px-4 pt-3 pb-safe bg-gradient-to-t from-[#f7f9fb] via-[#f7f9fb]/95 to-transparent z-40">
          <button
            onClick={handleContinue}
            disabled={!agreed || isSubmitting}
            className={`w-full py-3.5 px-6 rounded-2xl font-heading font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
              agreed && !isSubmitting
                ? 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-teal-glow active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Securing Consent Token...</span>
              </>
            ) : (
              <>
                <span>Agree & Continue / सहमत हैं और आगे बढ़ें</span>
                <ArrowRight className="size-4 sm:size-5" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
