import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, FileText, ImagePlus, Trash2, Upload } from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import { useLanguage } from '../../context/LanguageContext'

const typeKeys = { Prescription: 'prescription', 'Laboratory Report': 'labReport', 'Discharge Summary': 'dischargeSummary', 'Pharmacy Bill': 'pharmacyBill' }

export default function DocumentUpload() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const fileInputRef = useRef(null)
  const [selectedType, setSelectedType] = useState('Prescription')
  const [documents, setDocuments] = useState(() => { try { return JSON.parse(localStorage.getItem('arogya_documents') || '[]') } catch { return [] } })

  const addFiles = (files) => {
    const additions = Array.from(files || []).map((file, index) => ({ id: `doc-${Date.now()}-${index}`, fileName: file.name, category: selectedType, status: 'processed', uploadDate: new Date().toISOString().slice(0, 10) }))
    setDocuments((current) => [...additions, ...current])
  }
  const continueJourney = () => { localStorage.setItem('arogya_documents', JSON.stringify(documents)); navigate('/patient/document-review') }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <StitchAppHeader title={t('documentScanner')} showBack onBack={() => navigate('/patient/interview')} />
      <main className="mx-auto max-w-xl px-4 py-7 pb-28">
        <h1 className="text-3xl font-extrabold">{t('documentScanner')}</h1>
        <p className="mt-2 leading-7 text-slate-600">{t('documentScannerHelp')}</p>
        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">{t('chooseDocumentType')}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {Object.entries(typeKeys).map(([value, key]) => <button key={value} type="button" onClick={() => setSelectedType(value)} className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold ${selectedType === value ? 'border-[#174ea6] bg-blue-50 text-[#174ea6]' : 'border-slate-200 bg-white'}`}>{t(key, value)}</button>)}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 rounded-full bg-[#174ea6] px-4 py-3 font-bold text-white"><Upload className="size-5" /> {t('uploadFile')}</button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 rounded-full border border-[#174ea6] px-4 py-3 font-bold text-[#174ea6]"><Camera className="size-5" /> {t('takePhoto')}</button>
          </div>
        </section>
        <section className="mt-6">
          <h2 className="text-lg font-extrabold">{t('uploadedDocuments')}</h2>
          {documents.length === 0 ? <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500"><ImagePlus className="mx-auto size-8" /><p className="mt-2">{t('noDocuments')}</p></div> : <div className="mt-3 space-y-3">{documents.map((doc) => <article key={doc.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><FileText className="size-6 text-[#174ea6]" /><div className="min-w-0 flex-1"><p className="truncate font-bold">{doc.fileName}</p><p className="text-sm text-slate-500">{t(typeKeys[doc.category], doc.category)} · {t('processed')}</p></div><button type="button" onClick={() => setDocuments((current) => current.filter((item) => item.id !== doc.id))} aria-label={t('removeDocument')} className="rounded-full p-2 text-red-600"><Trash2 className="size-5" /></button></article>)}</div>}
        </section>
      </main>
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-4 pb-safe"><button type="button" onClick={continueJourney} className="mx-auto block w-full max-w-xl rounded-full bg-[#174ea6] px-5 py-3.5 font-bold text-white">{t('continueReview')}</button></div>
    </div>
  )
}
