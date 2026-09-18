// ============================
// ArogyaDarpan — Question Service Wrapper
// ============================

export const COMPLAINT_OPTIONS = [
  { id: 'chest_pain', label: 'Chest Pain', icon: '❤️' },
  { id: 'fever', label: 'Fever', icon: '🌡️' },
  { id: 'cough', label: 'Cough', icon: '🫁' },
  { id: 'stomach_pain', label: 'Stomach Pain', icon: '🤢' },
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'back_pain', label: 'Back Pain', icon: '🦴' },
  { id: 'breathing', label: 'Breathing Difficulty', icon: '💨' },
  { id: 'other', label: 'Other', icon: '➕' },
]

export const QUESTION_BANK = {
  common_start: [
    {
      id: 'chief_complaint',
      question: 'What brings you to the hospital today?',
      type: 'complaint_select',
      category: 'chief_complaint',
      required: true,
    },
  ],
  chest_pain: [
    { id: 'cp_onset', question: 'When did the pain start?', type: 'single_select', category: 'duration' },
    { id: 'cp_severity', question: 'On a scale of 1 to 10, how severe is the pain?', type: 'number', category: 'severity' },
    { id: 'cp_breathlessness', question: 'Are you having difficulty breathing?', type: 'yes_no', category: 'associated_symptoms' },
  ],
  fever: [
    { id: 'f_onset', question: 'When did the fever start?', type: 'single_select', category: 'duration' },
    { id: 'f_temperature', question: 'Do you know your temperature?', type: 'text', category: 'severity' },
  ],
  common_history: [
    { id: 'past_medical', question: 'Do you have any known medical conditions?', type: 'multi_select', category: 'past_history' },
    { id: 'current_medications', question: 'Are you currently taking any medicines regularly?', type: 'text', category: 'medications' },
    { id: 'allergies', question: 'Are you allergic to any medicine or food?', type: 'text', category: 'allergies' },
  ],
}

export function getQuestionSequence(complaintId) {
  const specific = QUESTION_BANK[complaintId] || []
  return [
    ...QUESTION_BANK.common_start,
    ...specific,
    ...QUESTION_BANK.common_history,
  ]
}
