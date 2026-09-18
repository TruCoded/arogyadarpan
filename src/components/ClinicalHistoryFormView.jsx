import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Check, Edit2, AlertCircle, Plus, Trash2, Heart,
  Activity, ShieldAlert, Pill, Users, Stethoscope, Scissors
} from 'lucide-react'
import Card from './Card'
import Button from './Button'
import Badge from './Badge'
import { useLanguage } from '../context/LanguageContext'

/**
 * ClinicalHistoryFormView — Structured 9-Category Clinical History Review & Edit Form
 * Allows patients and triage nurses to quickly review, fill, or update all structured history blocks.
 */
export default function ClinicalHistoryFormView({
  responses = [],
  onUpdateResponse,
  onClose,
  onSubmitAll
}) {
  const { t } = useLanguage()

  const getResponseVal = (id) => {
    const r = responses.find(resp => resp.questionId === id)
    return r?.structuredValue ?? r?.originalResponse ?? ''
  }

  // Local editable form state initialized from interview responses
  const [formData, setFormData] = useState({
    chiefComplaint: getResponseVal('chief_complaint') || 'Chest Pain',
    duration: getResponseVal('generic_onset') || getResponseVal('cp_onset') || '2_3_days',
    severity: getResponseVal('generic_severity') || getResponseVal('cp_severity') || 6,
    pastMedical: Array.isArray(getResponseVal('past_medical')) ? getResponseVal('past_medical') : ['hypertension'],
    pastSurgical: Array.isArray(getResponseVal('past_surgical')) ? getResponseVal('past_surgical') : ['appendectomy'],
    medications: getResponseVal('current_medications') || 'Amlodipine 5mg OD, Metformin 500mg BD',
    allergies: getResponseVal('allergies') || 'Penicillin (Skin rash)',
    familyHistory: Array.isArray(getResponseVal('family_history')) ? getResponseVal('family_history') : ['diabetes', 'hypertension'],
    smoking: getResponseVal('smoking_status') || 'never',
    alcohol: getResponseVal('alcohol_intake') || 'never',
    ros: Array.isArray(getResponseVal('ros_systems')) ? getResponseVal('ros_systems') : ['ros_fever'],
  })

  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleToggleMulti = (field, val) => {
    setFormData(prev => {
      const current = prev[field] || []
      const updated = current.includes(val)
        ? current.filter(item => item !== val)
        : [...current, val]
      return { ...prev, [field]: updated }
    })
  }

  const handleSave = () => {
    // Push updates back through onUpdateResponse
    if (onUpdateResponse) {
      onUpdateResponse('chief_complaint', formData.chiefComplaint)
      onUpdateResponse('past_medical', formData.pastMedical)
      onUpdateResponse('past_surgical', formData.pastSurgical)
      onUpdateResponse('current_medications', formData.medications)
      onUpdateResponse('allergies', formData.allergies)
      onUpdateResponse('family_history', formData.familyHistory)
      onUpdateResponse('smoking_status', formData.smoking)
      onUpdateResponse('alcohol_intake', formData.alcohol)
      onUpdateResponse('ros_systems', formData.ros)
    }

    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      if (onClose) onClose()
    }, 1200)
  }

  const MEDICAL_OPTIONS = [
    { id: 'diabetes', label: 'Diabetes Mellitus' },
    { id: 'hypertension', label: 'Hypertension (High BP)' },
    { id: 'heart_disease', label: 'Heart Disease / CAD' },
    { id: 'asthma', label: 'Asthma / COPD' },
    { id: 'thyroid', label: 'Thyroid Disorder' },
    { id: 'kidney_disease', label: 'Chronic Kidney Disease' },
  ]

  const SURGICAL_OPTIONS = [
    { id: 'appendectomy', label: 'Appendectomy' },
    { id: 'cholecystectomy', label: 'Gallbladder (Cholecystectomy)' },
    { id: 'c_section', label: 'C-Section' },
    { id: 'cardiac_surgery', label: 'Bypass / Heart Stent' },
    { id: 'hernia_repair', label: 'Hernia Repair' },
    { id: 'orthopedic_surgery', label: 'Orthopedic / Joint Surgery' },
    { id: 'cataract_surgery', label: 'Cataract / Eye Surgery' },
  ]

  const ROS_OPTIONS = [
    { id: 'ros_fever', label: 'Fever / Chills' },
    { id: 'ros_respiratory', label: 'Cough / Shortness of Breath' },
    { id: 'ros_cardio', label: 'Chest Pressure / Palpitations' },
    { id: 'ros_gi', label: 'Acidity / Vomiting / Diarrhea' },
    { id: 'ros_urinary', label: 'Burning / Frequent Urination' },
    { id: 'ros_neuro', label: 'Dizziness / Numbness' },
    { id: 'ros_musculo', label: 'Joint Pain / Stiffness' },
    { id: 'ros_skin', label: 'Skin Rash / Itching' },
  ]

  return (
    <div className="bg-surface-raised rounded-3xl border border-border-light shadow-xl p-6 sm:p-8 max-w-4xl mx-auto w-full my-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-border-light mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-md">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-heading">
              Structured Clinical History Form
            </h2>
            <p className="text-xs text-text-muted">
              Complete clinical history record aligned with standard hospital intake guidelines
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border-light bg-surface hover:bg-surface-muted transition-colors cursor-pointer"
          >
            Close
          </button>
        )}
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold"
        >
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Clinical history updated successfully!</span>
        </motion.div>
      )}

      {/* 9 Structured Sections */}
      <div className="space-y-6">
        {/* 1. Chief Complaint & 2. Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border-light">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary-700 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-primary-600" />
              <span>1. Chief Complaint</span>
            </div>
            <input
              type="text"
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface text-text-primary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Chest Pain, High Fever"
            />
          </Card>

          <Card className="border-border-light">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary-700 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-primary-600" />
              <span>2. Duration & Severity</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-border-light bg-surface text-text-primary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="today">Today (Sudden)</option>
                <option value="1_day">Yesterday</option>
                <option value="2_3_days">2-3 days ago</option>
                <option value="1_week">About 1 week</option>
                <option value="chronic">Weeks / Chronic</option>
              </select>
              <div className="flex items-center justify-between px-3 py-2 border border-border-light rounded-xl bg-surface">
                <span className="text-xs text-text-muted font-medium">Severity:</span>
                <span className="text-sm font-extrabold text-primary-600">{formData.severity}/10</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. Past Medical History */}
        <Card className="border-border-light">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-primary-700 uppercase tracking-wider">
            <Heart className="w-4 h-4 text-primary-600" />
            <span>3. Past Medical History</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {MEDICAL_OPTIONS.map(opt => {
              const selected = formData.pastMedical.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleToggleMulti('pastMedical', opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selected
                      ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                      : 'bg-surface border-border-light text-text-secondary hover:border-primary-300'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </Card>

        {/* 4. Past Surgical History */}
        <Card className="border-border-light">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-primary-700 uppercase tracking-wider">
            <Scissors className="w-4 h-4 text-primary-600" />
            <span>4. Past Surgical History (Operations)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SURGICAL_OPTIONS.map(opt => {
              const selected = formData.pastSurgical.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleToggleMulti('pastSurgical', opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selected
                      ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                      : 'bg-surface border-border-light text-text-secondary hover:border-primary-300'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </Card>

        {/* 5. Medication History & 6. Allergy History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border-light">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary-700 uppercase tracking-wider">
              <Pill className="w-4 h-4 text-primary-600" />
              <span>5. Current Medications</span>
            </div>
            <textarea
              rows={2}
              value={formData.medications}
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="e.g. Metformin 500mg, Amlodipine 5mg"
            />
          </Card>

          <Card className="border-border-light">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-critical uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-critical" />
              <span>6. Allergy History</span>
            </div>
            <textarea
              rows={2}
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="e.g. Penicillin, Sulfa, Peanuts, or No known allergies"
            />
          </Card>
        </div>

        {/* 7. Family History & 8. Personal History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border-light">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary-700 uppercase tracking-wider">
              <Users className="w-4 h-4 text-primary-600" />
              <span>7. Family History</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['diabetes', 'heart_disease', 'hypertension', 'cancer', 'stroke'].map(item => {
                const selected = formData.familyHistory.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleMulti('familyHistory', item)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      selected
                        ? 'bg-primary-100 text-primary-800 border-primary-300 font-bold'
                        : 'bg-surface text-text-secondary border-border-light'
                    }`}
                  >
                    {item.replace(/_/g, ' ').toUpperCase()}
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="border-border-light">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary-700 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-primary-600" />
              <span>8. Personal History (Habits)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-medium">Smoking:</label>
                <select
                  value={formData.smoking}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg border border-border-light bg-surface text-text-primary"
                >
                  <option value="never">Never</option>
                  <option value="current">Current Smoker</option>
                  <option value="quit">Ex-Smoker</option>
                </select>
              </div>
              <div>
                <label className="block text-text-muted mb-1 font-medium">Alcohol:</label>
                <select
                  value={formData.alcohol}
                  onChange={(e) => setFormData({ ...formData, alcohol: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg border border-border-light bg-surface text-text-primary"
                >
                  <option value="never">Never</option>
                  <option value="occasional">Social / Occasional</option>
                  <option value="regular">Regular</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* 9. Review of Systems (ROS) */}
        <Card className="border-border-light">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-primary-700 uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-primary-600" />
            <span>9. Review of Systems (ROS)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ROS_OPTIONS.map(opt => {
              const selected = formData.ros.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleToggleMulti('ros', opt.id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                    selected
                      ? 'bg-primary-50 text-primary-800 border-primary-400 font-bold'
                      : 'bg-surface text-text-secondary border-border-light hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-border-light">
        {onClose && (
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="lg" onClick={handleSave} icon={Check}>
          Save Clinical History
        </Button>
      </div>
    </div>
  )
}
