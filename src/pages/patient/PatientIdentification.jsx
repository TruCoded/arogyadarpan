import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  BadgePlus,
  CheckCircle2,
  CreditCard,
  FlaskConical,
  Hash,
  Phone,
  UserPlus,
} from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import { useLanguage } from '../../context/LanguageContext'
import { findPatientByIdentifier, generatePatientId, saveRegisteredPatient } from '../../services/sessionStore'

const LOGIN_OPTIONS = [
  { id: 'mobile', key: 'phone', fallback: 'Mobile Number', icon: Phone },
  { id: 'abha-number', key: 'abhaId', fallback: 'ABHA Number', icon: CreditCard },
  { id: 'abha-address', key: 'abhaAddress', fallback: 'ABHA Address', icon: AtSign },
  { id: 'patient-id', key: 'patientId', fallback: 'Hospital Patient ID', icon: Hash },
]

const EMPTY_FORM = { name: '', age: '', gender: '', phone: '', abhaId: '' }

export default function PatientIdentification() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [mode, setMode] = useState('options')
  const [identifier, setIdentifier] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const selected = LOGIN_OPTIONS.find((item) => item.id === mode)

  const demoProfile = (value) => {
    const simran = value.toLowerCase().includes('simran')
    return simran
      ? {
          patientId: 'P-10025',
          name: 'Simran Kaur',
          age: '28',
          gender: 'Female',
          phone: '9876543211',
          bloodGroup: 'O+',
          abhaId: 'simran.kaur@abdm',
          pastMedicalHistory: ['Type 2 Diabetes'],
          knownAllergies: ['Sulfa drugs'],
          isReturningPatient: true,
        }
      : {
          patientId: 'P-10024',
          name: 'Rahul Sharma',
          age: '46',
          gender: 'Male',
          phone: '9876543210',
          bloodGroup: 'B+',
          abhaId: '91-8842-1920-4491',
          pastMedicalHistory: ['Hypertension', 'Hyperlipidemia'],
          knownAllergies: ['Penicillin'],
          isReturningPatient: true,
        }
  }

  const continueWithIdentifier = () => {
    if (!identifier.trim()) {
      setMessage(t('patientNotFound', 'Please enter an identifier to continue.'))
      return
    }
    setLoading(true)
    setMessage('')

    window.setTimeout(() => {
      let patient = null
      if (mode === 'mobile' || mode === 'patient-id') patient = findPatientByIdentifier(identifier.trim())
      if (!patient && (mode === 'abha-number' || mode === 'abha-address')) patient = demoProfile(identifier.trim())

      if (!patient) {
        setLoading(false)
        setMessage(t('patientNotFound', 'No local patient record was found. You can register as a new patient.'))
        return
      }

      localStorage.setItem('arogya_patient', JSON.stringify({ ...patient, isReturningPatient: true }))
      navigate('/patient/interview')
    }, 450)
  }

  const registerPatient = (event) => {
    event.preventDefault()
    if (!form.name || !form.age || !form.gender || !/^\d{10}$/.test(form.phone)) {
      setMessage(t('patientSubtitle', 'Please complete the required details.'))
      return
    }

    const patient = {
      ...form,
      patientId: generatePatientId(),
      registeredAt: new Date().toISOString(),
      isReturningPatient: false,
    }
    saveRegisteredPatient(patient)
    localStorage.setItem('arogya_patient', JSON.stringify(patient))
    navigate('/patient/interview')
  }

  const openMode = (nextMode) => {
    setMode(nextMode)
    setIdentifier('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <StitchAppHeader title={t('patientRegistration', 'Patient check-in')} showBack onBack={() => navigate('/patient/consent')} />

      <main className="mx-auto w-full max-w-3xl px-5 pb-12 pt-8 sm:px-8">
        {mode === 'options' && (
          <>
            <p className="mb-2 text-sm font-semibold text-[#174ea6]">3 / 4</p>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t('existingPatient', 'Patient login')}</h1>
            <p className="mt-2 text-base text-slate-600">{t('patientSubtitle', 'Choose an option to get started.')}</p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
              {LOGIN_OPTIONS.map(({ id, key, fallback, icon: Icon }, index) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => openMode(id)}
                  className={`flex w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-slate-50 ${index ? 'border-t border-slate-200' : ''}`}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#174ea6]">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex-1 text-lg font-semibold">{t(key, fallback)}</span>
                  <ArrowRight className="size-5 text-slate-500" />
                </button>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-base font-bold text-slate-800">{t('notRegisteredYet', 'Not registered yet?')}</p>
              <button
                type="button"
                onClick={() => openMode('register')}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#174ea6] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#123b79]"
              >
                <UserPlus className="size-5" />
                {t('registerNow', 'Register now')}
              </button>
            </div>
          </>
        )}

        {selected && (
          <section>
            <button type="button" onClick={() => openMode('options')} className="mb-7 flex items-center gap-2 text-sm font-bold text-[#174ea6]">
              <ArrowLeft className="size-4" /> {t('back', 'Back')}
            </button>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-[#174ea6]">
                <selected.icon className="size-6" />
              </span>
              <div>
                <h1 className="text-2xl font-extrabold">{t(selected.key, selected.fallback)}</h1>
                <p className="mt-1 text-sm text-slate-600">{t('searchPatient', 'Enter your details to continue')}</p>
              </div>
            </div>

            {(mode === 'abha-number' || mode === 'abha-address') && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <FlaskConical className="mt-0.5 size-5 shrink-0" />
                <p>{t('prototypeNotice')}</p>
              </div>
            )}

            <label className="mt-7 block text-sm font-bold text-slate-800" htmlFor="patient-identifier">
              {t(selected.key, selected.fallback)}
            </label>
            <div className="relative flex items-center mt-2">
              {mode === 'mobile' && (
                <span className="absolute left-4 font-bold text-sm text-slate-600 select-none pointer-events-none">+91</span>
              )}
              <input
                id="patient-identifier"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && continueWithIdentifier()}
                placeholder={
                  mode === 'abha-number'
                    ? '91-0000-0000-0000'
                    : mode === 'abha-address'
                      ? 'name@abdm'
                      : t('phonePlaceholder', '10-digit mobile number')
                }
                className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base outline-none transition focus:border-[#174ea6] focus:ring-4 focus:ring-blue-100 ${
                  mode === 'mobile' ? 'pl-14' : ''
                }`}
                autoComplete="off"
              />
            </div>

            {message && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{message}</p>}

            <button
              type="button"
              onClick={continueWithIdentifier}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#174ea6] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#123b79] disabled:bg-slate-300"
            >
              {loading ? t('abdmPreparing', 'Checking...') : t('continue', 'Continue')}
              {!loading && <ArrowRight className="size-5" />}
            </button>

            {(mode === 'abha-number' || mode === 'abha-address') && (
              <button
                type="button"
                onClick={() => {
                  const patient = demoProfile(mode === 'abha-address' ? 'simran' : 'rahul')
                  localStorage.setItem('arogya_patient', JSON.stringify(patient))
                  navigate('/patient/interview')
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#174ea6] px-6 py-3 text-sm font-bold text-[#174ea6] hover:bg-blue-50"
              >
                <BadgePlus className="size-4" /> {t('useDemoPatient', 'Use demo patient')}
              </button>
            )}
          </section>
        )}

        {mode === 'register' && (
          <section>
            <button type="button" onClick={() => openMode('options')} className="mb-7 flex items-center gap-2 text-sm font-bold text-[#174ea6]">
              <ArrowLeft className="size-4" /> {t('back', 'Back')}
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight">{t('newRegistration', 'New patient registration')}</h1>
            <p className="mt-2 text-base text-slate-600">{t('patientSubtitle', 'Please enter your basic identification details.')}</p>

            <form onSubmit={registerPatient} className="mt-7 space-y-5">
              <Field label={t('name', 'Full name')}>
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="simple-input" placeholder={t('namePlaceholder', 'Full name')} />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label={t('age', 'Age')}>
                  <input type="number" min="0" max="125" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} className="simple-input" placeholder={t('enterAge', 'Age in years')} />
                </Field>
                <Field label={t('gender', 'Gender')}>
                  <select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} className="simple-input">
                    <option value="">{t('selectGender', 'Select gender')}</option>
                    <option value="Male">{t('male', 'Male')}</option>
                    <option value="Female">{t('female', 'Female')}</option>
                    <option value="Other">{t('other', 'Other')}</option>
                  </select>
                </Field>
              </div>

              <Field label={t('phone', 'Mobile number')}>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-bold text-sm text-slate-600 select-none pointer-events-none">+91</span>
                  <input inputMode="numeric" maxLength="10" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value.replace(/\D/g, '') })} className="simple-input pl-14" placeholder={t('phonePlaceholder', '10-digit mobile number')} />
                </div>
              </Field>
              <Field label={t('abhaId', 'ABHA ID (optional)')}>
                <input value={form.abhaId} onChange={(event) => setForm({ ...form, abhaId: event.target.value })} className="simple-input" placeholder={t('abhaPlaceholder', 'ABHA number or address')} />
              </Field>

              {message && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{message}</p>}

              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#174ea6] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#123b79]">
                <CheckCircle2 className="size-5" /> {t('continue', 'Register and continue')}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-bold text-slate-800">
      <span>{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  )
}
