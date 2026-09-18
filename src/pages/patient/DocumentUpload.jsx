import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, FileText, ImagePlus, Trash2, Upload, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import { useLanguage } from '../../context/LanguageContext'
import { scanMedicalDocument } from '../../services/ocrEngine'

const typeKeys = {
  Prescription: 'prescription',
  'Laboratory Report': 'labReport',
  'Discharge Summary': 'dischargeSummary',
  'Pharmacy Bill': 'pharmacyBill'
}

export default function DocumentUpload() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const fileInputRef = useRef(null)
  const [selectedType, setSelectedType] = useState('Prescription')
  const [isScanning, setIsScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState('')
  const [scanProgress, setScanProgress] = useState(0)

  const [documents, setDocuments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('arogya_documents') || '[]')
    } catch {
      return []
    }
  })

  const processFile = async (file) => {
    if (!file) return

    setIsScanning(true)
    setScanProgress(10)
    setScanStatus('Reading document image...')

    try {
      // 1. Create a local data URL preview
      const previewUrl = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      })

      // 2. Run real Tesseract OCR & Medical Entity Extraction pipeline
      const ocrResult = await scanMedicalDocument(file, ({ status, progress }) => {
        setScanStatus(status)
        setScanProgress(progress)
      })

      const newDoc = {
        id: `doc-${Date.now()}`,
        fileName: file.name,
        category: selectedType,
        status: 'processed',
        uploadDate: new Date().toISOString().slice(0, 10),
        previewUrl,
        ocrResult,
      }

      const updated = [newDoc, ...documents]
      setDocuments(updated)
      localStorage.setItem('arogya_documents', JSON.stringify(updated))
      localStorage.setItem('arogya_ocr_result', JSON.stringify(ocrResult))
      localStorage.setItem('arogya_last_doc_preview', previewUrl)

      setTimeout(() => {
        setIsScanning(false)
        navigate('/patient/document-review')
      }, 600)
    } catch (err) {
      console.error('OCR Processing error:', err)
      setIsScanning(false)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const continueJourney = () => {
    localStorage.setItem('arogya_documents', JSON.stringify(documents))
    navigate('/patient/document-review')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <StitchAppHeader title={t('documentScanner')} showBack onBack={() => navigate('/patient/interview')} />

      <main className="mx-auto max-w-xl px-4 py-7 pb-28">
        <h1 className="text-3xl font-extrabold">{t('documentScanner')}</h1>
        <p className="mt-2 leading-7 text-slate-600">{t('documentScannerHelp')}</p>

        {/* OCR Scanning Modal Overlay */}
        {isScanning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-center space-y-4">
              <div className="size-16 rounded-full bg-blue-50 text-[#174ea6] flex items-center justify-center mx-auto shadow-inner">
                <Loader2 className="size-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Scanning Medical Document
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium min-h-[1.5rem]">
                  {scanStatus}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#174ea6] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#174ea6]">
                <Sparkles className="size-3.5" />
                <span>Extracting Prescribed Medications & Dosages</span>
              </div>
            </div>
          </div>
        )}

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">{t('chooseDocumentType')}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {Object.entries(typeKeys).map(([value, key]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedType(value)}
                className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition cursor-pointer ${
                  selectedType === value
                    ? 'border-[#174ea6] bg-blue-50 text-[#174ea6]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {t(key, value)}
              </button>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isScanning}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-full bg-[#174ea6] hover:bg-[#123b79] px-4 py-3 font-bold text-white transition cursor-pointer"
            >
              <Upload className="size-5" />
              <span>{t('uploadFile')}</span>
            </button>
            <button
              type="button"
              disabled={isScanning}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-full border border-[#174ea6] hover:bg-blue-50 px-4 py-3 font-bold text-[#174ea6] transition cursor-pointer"
            >
              <Camera className="size-5" />
              <span>{t('takePhoto')}</span>
            </button>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-extrabold">{t('uploadedDocuments')}</h2>
          {documents.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              <ImagePlus className="mx-auto size-8 text-slate-400" />
              <p className="mt-2">{t('noDocuments')}</p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {documents.map((doc) => (
                <article
                  key={doc.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  {doc.previewUrl ? (
                    <img
                      src={doc.previewUrl}
                      alt={doc.fileName}
                      className="size-12 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#174ea6]">
                      <FileText className="size-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">{doc.fileName}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <span className="font-semibold text-[#174ea6]">
                        {t(typeKeys[doc.category], doc.category)}
                      </span>
                      <span>•</span>
                      <CheckCircle2 className="size-3 text-emerald-600 inline" />
                      <span>OCR Processed</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocuments((current) => current.filter((item) => item.id !== doc.id))}
                    aria-label={t('removeDocument')}
                    className="rounded-full p-2 text-slate-400 hover:text-red-600 transition cursor-pointer"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-5 py-4 pb-safe backdrop-blur">
        <button
          type="button"
          onClick={continueJourney}
          className="mx-auto block w-full max-w-xl rounded-full bg-[#174ea6] hover:bg-[#123b79] px-5 py-3.5 font-bold text-white transition cursor-pointer"
        >
          {t('continueReview')}
        </button>
      </div>
    </div>
  )
}

