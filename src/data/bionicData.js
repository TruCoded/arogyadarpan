// ==========================================
// Bionic Health Nexus — Clinical Data Model
// ==========================================

export const bionicPatient = {
  id: 'pt_00291',
  abhaId: '91-4829-1029',
  name: 'Ananya Sharma',
  age: 54,
  gender: 'Female',
  phone: '+91 98765 43210',
  bloodGroup: 'B+',
  esiTriageLevel: 3,
}

export const bionicVitals = [
  {
    id: 'bp',
    label: 'Blood Status',
    value: '116/70',
    unit: 'mmHg',
    status: 'normal',
    sparklineData: [62, 70, 55, 78, 66, 84, 59, 72, 68, 90, 61, 75],
  },
  {
    id: 'hr',
    label: 'Heart Rate',
    value: 120,
    unit: 'bpm',
    status: 'abnormal',
    direction: 'high',
    sparklineData: [110, 114, 118, 121, 117, 123, 120, 119, 122, 120],
  },
  {
    id: 'cbc',
    label: 'Blood Count',
    value: '80-90',
    unit: '%',
    status: 'normal',
    sparklineData: [40, 52, 44, 61, 48, 57, 50, 63, 46, 58],
  },
  {
    id: 'glucose',
    label: 'Glucose Level',
    value: 230,
    unit: 'mg/dL',
    status: 'critical',
    direction: 'high',
    sparklineData: [150, 168, 182, 176, 199, 210, 205, 224, 230, 228],
  },
]

export const bionicOrgans = [
  {
    id: 'lungs',
    name: 'Lungs',
    hindi: 'फेफड़े',
    status: 'normal',
    summary: 'Clear vesicular breath sounds bilaterally. No wheeze or rhonchi.',
    metrics: { spo2: '98%', respirationRate: '16/min' },
  },
  {
    id: 'heart',
    name: 'Heart',
    hindi: 'हृदय',
    status: 'monitor',
    summary: 'Sinus tachycardia at 120 bpm. Mild retrosternal pressure on exertion.',
    metrics: { bp: '116/70', rhythm: 'Sinus' },
  },
  {
    id: 'liver',
    name: 'Liver',
    hindi: 'यकृत',
    status: 'normal',
    summary: 'SGOT/SGPT within normal clinical bounds. No hepatomegaly.',
    metrics: { sgot: '24 U/L', sgpt: '28 U/L' },
  },
  {
    id: 'blood',
    name: 'Blood Cells',
    hindi: 'रक्त कोशिका',
    status: 'critical',
    summary: 'Significant hyperglycaemia detected (230 mg/dL). Elevated HbA1c 8.4%.',
    metrics: { hba1c: '8.4%', fastingGlucose: '230 mg/dL' },
  },
  {
    id: 'brain',
    name: 'Brain',
    hindi: 'मस्तिष्क',
    status: 'normal',
    summary: 'Alert and oriented x 3. Glasgow Coma Scale 15/15.',
    metrics: { gcs: '15/15', cognition: 'Clear' },
  },
]

export const bionicCareTeam = [
  { id: 'd1', name: 'Dr. Hanzer Jon', specialty: 'Cardiologist', avatar: 'HJ', room: 'OPD 104' },
  { id: 'd2', name: 'Dr. Steve Alex', specialty: 'Internal Medicine', avatar: 'SA', room: 'OPD 208' },
  { id: 'd3', name: 'Dr. Johan Fraz', specialty: 'Endocrinology', avatar: 'JF', room: 'OPD 312' },
]

export const bionicCategories = [
  { id: 'prescription', label: 'Prescriptions', hindi: 'नुस्खे', count: 4 },
  { id: 'laboratory', label: 'Lab Reports', hindi: 'जांच रिपोर्ट', count: 6 },
  { id: 'discharge', label: 'Discharge Summary', hindi: 'डिस्चार्ज समरी', count: 1 },
  { id: 'imaging', label: 'Imaging & Scans', hindi: 'एक्स-रे / सीटी', count: 2 },
  { id: 'certificate', label: 'Certificates', hindi: 'प्रमाण पत्र', count: 1 },
  { id: 'other', label: 'Other Records', hindi: 'अन्य', count: 2 },
]

export const bionicSymptomTiles = [
  { id: 'chest', en: 'Chest Discomfort', hi: 'सीने में दर्द / भारीपन', icon: 'heart' },
  { id: 'fever', en: 'High Fever & Chills', hi: 'तेज़ बुखार / ठंड लगना', icon: 'thermometer' },
  { id: 'breath', en: 'Breathlessness', hi: 'सांस लेने में कठिनाई', icon: 'wind' },
  { id: 'headache', en: 'Severe Headache', hi: 'सिर में तेज़ दर्द', icon: 'brain' },
  { id: 'stomach', en: 'Digestion / Nausea', hi: 'पेट दर्द / उल्टी', icon: 'stomach' },
  { id: 'fatigue', en: 'Extreme Fatigue', hi: 'थकान और कमजोरी', icon: 'activity' },
]
