// ==========================================
// Bionic Health Nexus — Clinical Data Model
// Multilingual support across 10 Indian Languages
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
    labels: {
      en: 'Blood Status', hi: 'रक्तचाप स्थिति', bn: 'রক্তচাপের স্থিতি', ta: 'இரத்த அழுத்த நிலை',
      te: 'రక్తపోటు స్థితి', mr: 'रक्तदाब स्थिती', gu: 'રક્તચાપ સ્થિતિ', kn: 'ರಕ್ತದೊತ್ತಡ ಸ್ಥಿತಿ',
      pa: 'ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਸਥਿਤੀ', ml: 'രക്തസമ്മർദ്ദ നില'
    },
    value: '116/70',
    unit: 'mmHg',
    status: 'normal',
    sparklineData: [62, 70, 55, 78, 66, 84, 59, 72, 68, 90, 61, 75],
  },
  {
    id: 'hr',
    label: 'Heart Rate',
    labels: {
      en: 'Heart Rate', hi: 'हृदय गति (धड़कन)', bn: 'হার্ট রেট', ta: 'இதயத் துடிப்பு',
      te: 'గుండె వేగం', mr: 'हृदय गती', gu: 'હૃદયના ધબકારા', kn: 'ಹೃದಯ ಬಡಿತ',
      pa: 'ਦਿਲ ਦੀ ਧੜਕਣ', ml: 'ഹൃദയമിടിപ്പ്'
    },
    value: 120,
    unit: 'bpm',
    status: 'abnormal',
    direction: 'high',
    sparklineData: [110, 114, 118, 121, 117, 123, 120, 119, 122, 120],
  },
  {
    id: 'cbc',
    label: 'Blood Count',
    labels: {
      en: 'Blood Count', hi: 'रक्त गणना', bn: 'ব্লাড কাউন্ট', ta: 'இரத்த எண்ணிக்கை',
      te: 'రక్త గణన', mr: 'रक्त गणना', gu: 'બ્લડ કાઉન્ટ', kn: 'ರಕ್ತದ ಎಣಿಕೆ',
      pa: 'ਖੂਨ ਦੀ ਗਿਣਤੀ', ml: 'രക്തപരിശോധന'
    },
    value: '80-90',
    unit: '%',
    status: 'normal',
    sparklineData: [40, 52, 44, 61, 48, 57, 50, 63, 46, 58],
  },
  {
    id: 'glucose',
    label: 'Glucose Level',
    labels: {
      en: 'Glucose Level', hi: 'शुगर का स्तर', bn: 'গ্লুকোজ স্তর', ta: 'சர்க்கரை அளவு',
      te: 'గ్లూకోజ్ స్థాయి', mr: 'ग्लुकोज पातळी', gu: 'ગ્લુકોઝ સ્તર', kn: 'ಗ್ಲೂಕೋಸ್ ಮಟ್ಟ',
      pa: 'ਗਲੂਕੋਜ਼ ਪੱਧਰ', ml: 'ഗ്ലൂക്കോസ് നില'
    },
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
    emoji: '🫁',
    names: {
      en: 'Lungs', hi: 'फेफड़े', bn: 'ফুসফুস', ta: 'நுரையீரல்', te: 'ఊపిరితిత్తులు',
      mr: 'फुफ्फुस', gu: 'ફેફસાં', kn: 'ಶ್ವಾಸಕೋಶ', pa: 'ਫੇਫੜੇ', ml: 'ശ്വാസകോശം'
    },
    hindi: 'फेफड़े',
    status: 'normal',
    summary: 'Clear vesicular breath sounds bilaterally. No wheeze or rhonchi.',
    summaries: {
      en: 'Clear vesicular breath sounds bilaterally. No wheeze or rhonchi.',
      hi: 'दोनों तरफ सामान्य श्वसन ध्वनियाँ। कोई घरघराहट या रुकावट नहीं।',
      bn: 'উভয় দিকে স্বাভাবিক শ্বাস-প্রশ্বাসের শব্দ। কোনো সমস্যা নেই।',
      ta: 'இருபுறமும் சீரான சுவாச ஒலி. எந்த மூச்சுத்திணறலும் இல்லை.',
      te: 'రెండు వైపులా సాధారణ శ్వాస శబ్దాలు. ఎటువంటి శ్వాస సమస్య లేదు.',
      mr: 'दोन्ही बाजूंना सामान्य श्वासोच्छवासाचा आवाज. कोणतीही अडचण नाही.',
      gu: 'બંને બાજુ સામાન્ય શ્વાસોચ્છવાસનો અવાજ. કોઈ તકલીફ નથી.',
      kn: 'ಎರಡೂ ಬದಿಗಳಲ್ಲಿ ಸಾಮಾನ್ಯ ಉಸಿರಾಟದ ಶಬ್ದಗಳು. ಯಾವುದೇ ತೊಂದರೆಯಿಲ್ಲ.',
      pa: 'ਦੋਵੇਂ ਪਾਸੇ ਆਮ ਸਾਹ ਦੀਆਂ ਆਵਾਜ਼ਾਂ। ਕੋਈ ਘੁਰਘੁਰਾਹਟ ਨਹੀਂ।',
      ml: 'രണ്ട് വശങ്ങളിലും സാധാരണ ശ്വാസോച്ഛ്വാസ ശബ്ദം.'
    },
    metrics: { spo2: '98%', respirationRate: '16/min' },
  },
  {
    id: 'heart',
    name: 'Heart',
    emoji: '🫀',
    names: {
      en: 'Heart', hi: 'हृदय', bn: 'হৃদযন্ত্র', ta: 'இதயம்', te: 'గుండె',
      mr: 'हृदय', gu: 'હૃદય', kn: 'ಹೃದಯ', pa: 'ਦਿਲ', ml: 'ഹൃദയം'
    },
    hindi: 'हृदय',
    status: 'monitor',
    summary: 'Sinus tachycardia at 120 bpm. Mild retrosternal pressure on exertion.',
    summaries: {
      en: 'Sinus tachycardia at 120 bpm. Mild retrosternal pressure on exertion.',
      hi: 'साइनस टैचीकार्डिया (120 bpm)। परिश्रम पर सीने में हल्का दबाव।',
      bn: 'সাইনাস ট্যাকিকার্ডিয়া (১২০ bpm)। পরিশ্রমে বুকে হালকা চাপ।',
      ta: '120 bpm சைனஸ் டாக்ரிக்கார்டியா. உழைப்பில் நெஞ்சில் லேசான அழுத்தம்.',
      te: '120 bpm వద్ద సైనస్ టాచీకార్డియా. శ్రమతో ఛాతీలో స్వల్ప ఒత్తిడి.',
      mr: '120 bpm वर साइनस टाकीकार्डिया. श्रमावर छातीत हलका दाब.',
      gu: '120 bpm પર સાઇનસ ટાકીકાર્ડિયા. શ્રમ પર છાતીમાં હળવું દબાણ.',
      kn: '120 bpm ನಲ್ಲಿ ಸೈನಸ್ ಟಾಕಿಕಾರ್ಡಿಯಾ. ಶ್ರಮದ ಮೇಲೆ ಎದೆಯಲ್ಲಿ ಲಘು ಒತ್ತಡ.',
      pa: '120 bpm ਤੇ ਸਾਈਨਸ ਟੈਕੀਕਾਰਡੀਆ। ਮਿਹਨਤ ਕਰਨ ਤੇ ਛਾਤੀ ਵਿੱਚ ਹਲਕਾ ਦਬਾਅ।',
      ml: '120 bpm-ൽ സൈനസ് ടാക്കികാർഡിയ. അധ്വാനിക്കുമ്പോൾ നെഞ്ചിൽ നേരിയ മർദ്ദം.'
    },
    metrics: { bp: '116/70', rhythm: 'Sinus' },
  },
  {
    id: 'liver',
    name: 'Liver',
    emoji: '🟤',
    names: {
      en: 'Liver', hi: 'यकृत (लीवर)', bn: 'যকৃত', ta: 'கல்லீரல்', te: 'కాలేయం',
      mr: 'यकृत', gu: 'યકૃત', kn: 'ಯಕೃತ್ತು', pa: 'ਜਿਗਰ', ml: 'കരൾ'
    },
    hindi: 'यकृत',
    status: 'normal',
    summary: 'SGOT/SGPT within normal clinical bounds. No hepatomegaly.',
    summaries: {
      en: 'SGOT/SGPT within normal clinical bounds. No hepatomegaly.',
      hi: 'एसजीओटी/एसजीपीटी सामान्य सीमा के भीतर। कोई यकृत सूजन नहीं।',
      bn: 'এসজিওটি/এসজিপিটি স্বাভাবিক সীমার মধ্যে। কোনো যকৃত বৃদ্ধি নেই।',
      ta: 'SGOT/SGPT இயல்பான வரம்பிற்குள் உள்ளது. கல்லீரல் வீக்கம் இல்லை.',
      te: 'SGOT/SGPT సాధారణ పరిధిలో ఉంది. కాలేయ వాపు లేదు.',
      mr: 'SGOT/SGPT सामान्य मर्यादेत आहे. यकृताला सूज नाही.',
      gu: 'SGOT/SGPT સામાન્ય મર્યાદામાં છે. યકૃતમાં સોજો નથી.',
      kn: 'SGOT/SGPT ಸಾಮಾನ್ಯ ಮಿತಿಯಲ್ಲಿದೆ. ಯಕೃತ್ತಿನ ಊತವಿಲ್ಲ.',
      pa: 'SGOT/SGPT ਆਮ ਸੀਮਾ ਵਿੱਚ ਹਨ। ਜਿਗਰ ਵਿੱਚ ਕੋਈ ਸੋਜ ਨਹੀਂ।',
      ml: 'SGOT/SGPT സാധാരണ നിലയിൽ. കരൾ വീക്കം ഇല്ല.'
    },
    metrics: { sgot: '24 U/L', sgpt: '28 U/L' },
  },
  {
    id: 'blood',
    name: 'Blood Cells',
    emoji: '🩸',
    names: {
      en: 'Blood Cells', hi: 'रक्त कोशिकाएं', bn: 'রক্তকোষ', ta: 'இரத்த அணுக்கள்', te: 'రక్త కణాలు',
      mr: 'रक्तपेशी', gu: 'રક્તકણો', kn: 'ರಕ್ತ ಕಣಗಳು', pa: 'ਖੂਨ ਦੇ ਸੈੱਲ', ml: 'രക്തകോശങ്ങൾ'
    },
    hindi: 'रक्त कोशिका',
    status: 'critical',
    summary: 'Significant hyperglycaemia detected (230 mg/dL). Elevated HbA1c 8.4%.',
    summaries: {
      en: 'Significant hyperglycaemia detected (230 mg/dL). Elevated HbA1c 8.4%.',
      hi: 'रक्त में शर्करा का उच्च स्तर (230 mg/dL)। बढ़ा हुआ HbA1c 8.4%।',
      bn: 'রক্তে উচ্চ শর্করার মাত্রা (২৩০ mg/dL)। বর্ধিত HbA1c ৮.৪%।',
      ta: 'அதிக இரத்த சர்க்கரை அளவு (230 mg/dL). அதிகரித்த HbA1c 8.4%.',
      te: 'అధిక రక్త చక్కెర స్థాయి (230 mg/dL). పెరిగిన HbA1c 8.4%.',
      mr: 'रक्तातील साखरेची उच्च पातळी (230 mg/dL). वाढलेले HbA1c 8.4%.',
      gu: 'લોહીમાં સુગરનું ઉચ્ચ સ્તર (230 mg/dL). વધેલું HbA1c 8.4%.',
      kn: 'ರಕ್ತದಲ್ಲಿ ಹೆಚ್ಚಿನ ಸಕ್ಕರೆ ಮಟ್ಟ (230 mg/dL). ಹೆಚ್ಚಿದ HbA1c 8.4%.',
      pa: 'ਖੂਨ ਵਿੱਚ ਸ਼ੂਗਰ ਦਾ ਉੱਚ ਪੱਧਰ (230 mg/dL)। ਵਧਿਆ ਹੋਇਆ HbA1c 8.4%।',
      ml: 'രക്തത്തിൽ ഉയർന്ന പഞ്ചസാരയുടെ അളവ് (230 mg/dL). ഉയർന്ന HbA1c 8.4%.'
    },
    metrics: { hba1c: '8.4%', fastingGlucose: '230 mg/dL' },
  },
  {
    id: 'brain',
    name: 'Brain',
    emoji: '🧠',
    names: {
      en: 'Brain', hi: 'मस्तिष्क (दिमाग)', bn: 'মস্তিষ্ক', ta: 'மூளை', te: 'మెదడు',
      mr: 'मेंदू', gu: 'મગજ', kn: 'ಮೆದುಳು', pa: 'ਦਿਮਾਗ', ml: 'മസ്തിഷ്കം'
    },
    hindi: 'मस्तिष्क',
    status: 'normal',
    summary: 'Alert and oriented x 3. Glasgow Coma Scale 15/15.',
    summaries: {
      en: 'Alert and oriented x 3. Glasgow Coma Scale 15/15.',
      hi: 'सचेत और पूरी तरह उन्मुख। ग्लासगो कोमा स्केल 15/15।',
      bn: 'সচেতন এবং স্বাভাবিক। গ্লাসগো কোমা স্কেল ১৫/১৫।',
      ta: 'முழு விழிப்புணர்வு மற்றும் நோக்குநிலை. கிளாஸ்கோ கோமா அளவுகோல் 15/15.',
      te: 'పూర్తి స్పృహ మరియు సాధారణ స్థితి. గ్లాస్గో కోమా స్కేల్ 15/15.',
      mr: 'पूर्णपणे जागरूक आणि सामान्य. ग्लासगो कोमा स्केल 15/15.',
      gu: 'સંપૂર્ણ સજાગ અને સામાન્ય. ગ્લાસગો કોમા સ્કેલ 15/15.',
      kn: 'ಸಂಪೂರ್ಣ ಜಾಗರೂಕತೆ ಮತ್ತು ಸಾಮಾನ್ಯ ಸ್ಥಿತಿ. ಗ್ಲ್ಯಾಸ್ಗೋ ಕೋಮಾ ಸ್ಕೇಲ್ 15/15.',
      pa: 'ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਚੇਤ ਅਤੇ ਆਮ। ਗਲਾਸਗੋ ਕੋਮਾ ਸਕੇਲ 15/15।',
      ml: 'പൂർണ്ണ ബോധവും സാധാരണ നിലയും. ഗ്ലാസ്ഗോ കോമ സ്കെയിൽ 15/15.'
    },
    metrics: { gcs: '15/15', cognition: 'Clear' },
  },
]

export function getLocalizedOrganName(organ, lang = 'en') {
  if (!organ) return ''
  if (organ.names && organ.names[lang]) return organ.names[lang]
  if (lang === 'hi' && organ.hindi) return organ.hindi
  return organ.name || ''
}

export function getLocalizedOrganSummary(organ, lang = 'en') {
  if (!organ) return ''
  if (organ.summaries && organ.summaries[lang]) return organ.summaries[lang]
  return organ.summary || ''
}

export function getLocalizedStatusLabel(status, lang = 'en') {
  const s = String(status || '').toLowerCase()
  const map = {
    normal: { en: 'NORMAL', hi: 'सामान्य', bn: 'স্বাভাবিক', ta: 'இயல்பு', te: 'సాధారణ', mr: 'सामान्य', gu: 'સામાન્ય', kn: 'ಸಾಮಾನ್ಯ', pa: 'ਸਧਾਰਨ', ml: 'സാധാരണ' },
    monitor: { en: 'MONITOR', hi: 'निगरानी', bn: 'পর্যবেক্ষণ', ta: 'கண்காணிப்பு', te: 'పర్యవేక్షణ', mr: 'निगरानी', gu: 'દેખરેખ', kn: 'ಮೇಲ್ವಿಚಾರಣೆ', pa: 'ਨਿਗਰਾਨੀ', ml: 'നിരീക്ഷണം' },
    abnormal: { en: 'ABNORMAL', hi: 'असामान्य', bn: 'অস্বাভাবিক', ta: 'அசாதாரண', te: 'అసాధారణ', mr: 'असामान्य', gu: 'અસામાન્ય', kn: 'ಅಸಹಜ', pa: 'ਅਸਧਾਰਨ', ml: 'അസാധാരണ' },
    critical: { en: 'CRITICAL', hi: 'गंभीर', bn: 'সংকটজনক', ta: 'தீவிரமானது', te: 'క్లిష్టమైనది', mr: 'गंभीर', gu: 'ગંભીર', kn: 'ಗಂಭೀರ', pa: 'ਗੰਭੀਰ', ml: 'ഗുരുതരം' },
    flagged: { en: 'FLAGGED', hi: 'चेतावनी', bn: 'সতর্কতা', ta: 'எச்சரிக்கை', te: 'హెచ్చరిక', mr: 'इशारा', gu: 'ચેતવણી', kn: 'ಎಚ್ಚರಿಕೆ', pa: 'ਚੇਤਾਵਨੀ', ml: 'മുന്നറിയിപ്പ്' },
    active: { en: 'ACTIVE', hi: 'सक्रिय', bn: 'সক্রিয়', ta: 'செயலில்', te: 'సక్రియ', mr: 'सक्रिय', gu: 'સક્રિય', kn: 'ಸಕ್ರಿಯ', pa: 'ਸਰਗਰਮ', ml: 'സജീവം' },
    verified: { en: 'VERIFIED', hi: 'सत्यापित', bn: 'যাচাইকৃত', ta: 'சரிபார்க்கப்பட்டது', te: 'ధృవీకరించబడింది', mr: 'सत्यापित', gu: 'ચકાસાયેલ', kn: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ', pa: 'ਤਸਦੀਕਸ਼ੁਦਾ', ml: 'സ്ഥിരീകരിച്ചു' },
  }
  return map[s]?.[lang] || map[s]?.en || String(status).toUpperCase()
}

export const bionicCareTeam = [
  {
    id: 'd1',
    name: 'Dr. Hanzer Jon',
    specialty: 'Cardiologist',
    specialties: {
      en: 'Cardiologist', hi: 'हृदय रोग विशेषज्ञ', bn: 'হৃদরোগ বিশেষজ্ঞ', ta: 'இதய நிபுணர்',
      te: 'గుండె నిపుణుడు', mr: 'हृदयरोगतज्ज्ञ', gu: 'હૃદયરોગ નિષ્ણાત', kn: 'ಹೃದ್ರೋಗ ತಜ್ಞ',
      pa: 'ਦਿਲ ਦਾ ਮਾਹਰ', ml: 'കാർഡിയോളജിസ്റ്റ്'
    },
    avatar: 'HJ',
    room: 'OPD 104'
  },
  {
    id: 'd2',
    name: 'Dr. Steve Alex',
    specialty: 'Internal Medicine',
    specialties: {
      en: 'Internal Medicine', hi: 'सामान्य चिकित्सा', bn: 'অভ্যন্তরীণ চিকিৎসা', ta: 'பொது மருத்துவம்',
      te: 'సాధారణ వైద్యం', mr: 'अंतर्गत औषधोपचार', gu: 'આંતરિક દવા', kn: 'ಸಾಮಾನ್ಯ ಔಷಧ',
      pa: 'ਜਨਰਲ ਦਵਾਈ', ml: 'ജനറൽ മെഡിസിൻ'
    },
    avatar: 'SA',
    room: 'OPD 208'
  },
  {
    id: 'd3',
    name: 'Dr. Johan Fraz',
    specialty: 'Endocrinology',
    specialties: {
      en: 'Endocrinology', hi: 'हार्मोन एवं मधुमेह विशेषज्ञ', bn: 'হরমোন ও ডায়াবেটিস বিশেষজ্ঞ', ta: 'நாளமில்லா சுரப்பி நிபுணர்',
      te: 'ఎండోక్రినాలజీ', mr: 'अंतःस्रावी तज्ज्ञ', gu: 'એન્ડોક્રિનોલોજી', kn: 'ಅಂತಃಸ್ರಾವಕ ತಜ್ಞ',
      pa: 'ਹਾਰਮੋਨ ਤੇ ਸ਼ੂਗਰ ਮਾਹਰ', ml: 'എൻഡോക്രൈനോളജി'
    },
    avatar: 'JF',
    room: 'OPD 312'
  },
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
