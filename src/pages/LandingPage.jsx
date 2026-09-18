import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, Languages, Stethoscope, UserRound } from 'lucide-react'
import ArogyaDarpanLogo from '../components/ArogyaDarpanLogo'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const steps = [
    { icon: UserRound, title: t('patientRegistration', 'Patient check-in'), text: t('enterDetailsStep') },
    { icon: Stethoscope, title: t('healthInterview', 'Health interview'), text: t('answerQuestionsStep') },
    { icon: FileText, title: t('uploadDocuments', 'Previous records'), text: t('uploadRecordsStep') },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center gap-3 px-5 py-3 sm:px-8">
          <ArogyaDarpanLogo size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-base font-extrabold text-[#123b79]">ArogyaDarpan</p>
            <p className="text-xs text-slate-500">{t('clinicalIntakeAssistant')}</p>
          </div>
          <LanguageSelector variant="compact" />
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-[#174ea6]">
              <Languages className="size-4" /> {t('multilingualSupport')}
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              {t('heroDescription')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/patient/language')}
                className="flex items-center justify-center gap-2 rounded-full bg-[#174ea6] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#123b79]"
              >
                {t('startPatient', 'Start patient journey')} <ArrowRight className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/doctor')}
                className="flex items-center justify-center gap-2 rounded-full border border-[#174ea6] px-6 py-3.5 text-base font-bold text-[#174ea6] transition hover:bg-blue-50"
              >
                {t('doctorDashboard', 'Doctor dashboard')}
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-[#174ea6] p-7 text-white sm:p-9">
            <p className="text-sm font-bold text-blue-100">{t('todayVisit')}</p>
            <h2 className="mt-2 text-2xl font-extrabold">{t('fourSteps')}</h2>
            <ol className="mt-7 space-y-5">
              {[
                t('choosePreferredLanguage'),
                t('giveConsentCheckIn'),
                t('answerQuestions'),
                t('reviewSendSummary'),
              ].map((item, index) => (
                <li key={item} className="flex items-center gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#174ea6]">{index + 1}</span>
                  <span className="text-base font-semibold">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
            <h2 className="text-2xl font-extrabold">{t('howItWorks')}</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-[#174ea6]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-8 text-sm text-slate-500 sm:px-8">
        <p className="font-bold text-slate-700">ArogyaDarpan • SIH 2026</p>
        <p>{t('prototypeNotice')}</p>
      </footer>
    </div>
  )
}
