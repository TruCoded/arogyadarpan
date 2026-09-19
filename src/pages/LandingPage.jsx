import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, Languages, Stethoscope, UserRound, Sparkles, Shield, Cpu, Play } from 'lucide-react'
import ArogyaDarpanLogo from '../components/ArogyaDarpanLogo'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { t, currentLanguageMeta } = useLanguage()

  const steps = [
    { icon: UserRound, title: t('patientRegistration', 'Patient check-in'), text: t('enterDetailsStep') },
    { icon: Stethoscope, title: t('healthInterview', 'Health interview'), text: t('answerQuestionsStep') },
    { icon: FileText, title: t('uploadDocuments', 'Previous records'), text: t('uploadRecordsStep') },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all shadow-xs">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <ArogyaDarpanLogo size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#123b79]">ArogyaDarpan</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#174ea6] border border-blue-200">
                  MediKiosk Solution
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{t('clinicalIntakeAssistant', 'Patient Intake & Clinical Triage')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector variant="compact" />
            <button
              type="button"
              onClick={() => navigate('/demo')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <Play className="size-3 text-[#174ea6]" />
              {t('tryDemo', 'Try Demo')}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3.5 py-1.5 text-xs font-bold text-[#174ea6] border border-blue-200/80 shadow-xs mb-4">
              <Languages className="size-3.5" />
              <span>{t('multilingualSupport', '10 Indian Languages Supported')}</span>
              <span className="size-1 rounded-full bg-blue-400" />
              <span className="text-slate-500 font-normal">Bhashini & AI4Bharat ASR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-slate-900">
              {t('heroTitle', 'Your health story, ready before the consultation.')}
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600">
              {t(
                'heroDescription',
                'A multilingual AI clinical intake platform that collects patient history through voice or touch, digitizes previous prescriptions, and structures a pre-consultation summary.'
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/patient/language')}
                className="group flex items-center justify-center gap-2.5 rounded-full bg-[#174ea6] px-7 py-4 text-base font-bold text-white transition-all duration-200 hover:bg-[#123b79] hover:shadow-lg hover:shadow-blue-900/20 active:scale-98 cursor-pointer"
              >
                <span>{t('startPatient', 'Start Patient Intake')}</span>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/doctor')}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-slate-300 hover:border-[#174ea6] bg-white px-6 py-4 text-base font-bold text-slate-800 hover:text-[#174ea6] transition-all duration-200 hover:bg-blue-50/50 hover:shadow-sm active:scale-98 cursor-pointer"
              >
                <Stethoscope className="size-5 text-[#174ea6]" />
                <span>{t('doctorDashboard', 'Doctor Dashboard')}</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="mt-8 flex flex-wrap gap-2 text-xs text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <Shield className="size-3.5 text-emerald-600" /> DPDP Act 2023 & ABDM
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <Sparkles className="size-3.5 text-[#174ea6]" /> Dashavidha Pariksha (AYUSH)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <Cpu className="size-3.5 text-indigo-600" /> Module C Clinical History
              </span>
            </div>
          </div>

          {/* Right Card: Journey Progression */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#174ea6] via-[#123b79] to-[#0f2d5c] p-7 sm:p-9 text-white shadow-xl shadow-blue-950/20 border border-blue-400/20">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
                {t('todayVisit', "Today's Clinic Intake")}
              </p>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-mono font-medium backdrop-blur">
                MediKiosk Flow
              </span>
            </div>

            <h2 className="mt-2 text-xl sm:text-2xl font-black">{t('fourSteps', 'Complete your history in four steps')}</h2>

            <ol className="mt-6 space-y-4">
              {[
                { label: t('choosePreferredLanguage', 'Choose your preferred language'), detail: '10 Indian Languages' },
                { label: t('giveConsentCheckIn', 'DPDP Consent & Patient Check-in'), detail: 'ABHA / Mobile Verification' },
                { label: t('answerQuestions', 'Voice & Touch Clinical Interview'), detail: 'SOCRATES & Dashavidha Pariksha' },
                { label: t('reviewSendSummary', 'Review Records & Send to Doctor'), detail: 'Real-Time EHR / ABDM Ready' },
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-[#174ea6] shadow-sm">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-white">{item.label}</span>
                    <span className="block text-[11px] text-blue-200/80">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* How It Works Grid */}
        <section className="border-y border-slate-200/80 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-xs font-bold text-[#174ea6] uppercase tracking-wider">Streamlined Architecture</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {t('howItWorks', 'How ArogyaDarpan Works')}
                </h2>
              </div>
              <p className="text-sm text-slate-500 max-w-md">
                End-to-end intelligent triage bridging patients, regional languages, medical OCR, and physician EHRs.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#174ea6] border border-blue-100 transition-transform group-hover:scale-110 group-hover:bg-[#174ea6] group-hover:text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ArogyaDarpanLogo size="xs" />
            <span className="font-bold text-slate-700">ArogyaDarpan</span>
            <span>•</span>
            <span>Multilingual Patient Intake & Clinical Triage MediKiosk</span>
          </div>
          <p className="text-center sm:text-right">{t('prototypeNotice', 'Clinical Decision Support System. Consulting physicians make all diagnostic decisions.')}</p>
        </div>
      </footer>
    </div>
  )
}
