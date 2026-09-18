// Copy used by the simplified patient check-in flow. Keeping this separate
// makes it easy to audit which high-traffic labels are translated.
const coreUiTranslations = {
  en: {
    patientRegistration: 'Patient check-in', newRegistration: 'New patient registration', existingPatient: 'Patient login',
    patientId: 'Hospital Patient ID', enterAge: 'Age in years', searchPatient: 'Enter your details to continue',
    searchPatientPlaceholder: 'Enter mobile number or patient ID', patientNotFound: 'No local patient record was found.',
    abhaAddress: 'ABHA Address', notRegisteredYet: 'Not registered yet?', registerNow: 'Register now', useDemoPatient: 'Use demo patient',
  },
  hi: {
    patientRegistration: 'रोगी चेक-इन', newRegistration: 'नया रोगी पंजीकरण', existingPatient: 'रोगी लॉगिन',
    patientId: 'अस्पताल रोगी आईडी', enterAge: 'आयु वर्षों में', searchPatient: 'आगे बढ़ने के लिए विवरण दर्ज करें',
    searchPatientPlaceholder: 'मोबाइल नंबर या रोगी आईडी दर्ज करें', patientNotFound: 'स्थानीय रोगी रिकॉर्ड नहीं मिला।',
    abhaAddress: 'ABHA पता', notRegisteredYet: 'अभी पंजीकृत नहीं हैं?', registerNow: 'अभी पंजीकरण करें', useDemoPatient: 'डेमो रोगी का उपयोग करें',
  },
  bn: {
    patientRegistration: 'রোগী চেক-ইন', newRegistration: 'নতুন রোগী নিবন্ধন', existingPatient: 'রোগী লগইন',
    patientId: 'হাসপাতালের রোগী আইডি', enterAge: 'বছরে বয়স', searchPatient: 'এগিয়ে যেতে তথ্য লিখুন',
    searchPatientPlaceholder: 'মোবাইল নম্বর বা রোগী আইডি লিখুন', patientNotFound: 'স্থানীয় রোগীর রেকর্ড পাওয়া যায়নি।',
    abhaAddress: 'ABHA ঠিকানা', notRegisteredYet: 'এখনও নিবন্ধিত নন?', registerNow: 'এখন নিবন্ধন করুন', useDemoPatient: 'ডেমো রোগী ব্যবহার করুন',
  },
  ta: {
    patientRegistration: 'நோயாளர் செக்-இன்', newRegistration: 'புதிய நோயாளர் பதிவு', existingPatient: 'நோயாளர் உள்நுழைவு',
    patientId: 'மருத்துவமனை நோயாளர் ஐடி', enterAge: 'வயது', searchPatient: 'தொடர உங்கள் விவரங்களை உள்ளிடவும்',
    searchPatientPlaceholder: 'மொபைல் எண் அல்லது நோயாளர் ஐடி', patientNotFound: 'உள்ளூர் நோயாளர் பதிவு கிடைக்கவில்லை.',
    abhaAddress: 'ABHA முகவரி', notRegisteredYet: 'இன்னும் பதிவு செய்யவில்லையா?', registerNow: 'இப்போது பதிவு செய்க', useDemoPatient: 'டெமோ நோயாளியைப் பயன்படுத்துக',
  },
  te: {
    patientRegistration: 'రోగి చెక్-ఇన్', newRegistration: 'కొత్త రోగి నమోదు', existingPatient: 'రోగి లాగిన్',
    patientId: 'ఆసుపత్రి రోగి ఐడి', enterAge: 'వయస్సు సంవత్సరాల్లో', searchPatient: 'కొనసాగడానికి వివరాలు నమోదు చేయండి',
    searchPatientPlaceholder: 'మొబైల్ నంబర్ లేదా రోగి ఐడి', patientNotFound: 'స్థానిక రోగి రికార్డు కనుగొనబడలేదు.',
    abhaAddress: 'ABHA చిరునామా', notRegisteredYet: 'ఇంకా నమోదు కాలేదా?', registerNow: 'ఇప్పుడే నమోదు చేయండి', useDemoPatient: 'డెమో రోగిని ఉపయోగించండి',
  },
  mr: {
    patientRegistration: 'रुग्ण चेक-इन', newRegistration: 'नवीन रुग्ण नोंदणी', existingPatient: 'रुग्ण लॉगिन',
    patientId: 'रुग्णालय रुग्ण आयडी', enterAge: 'वय वर्षांमध्ये', searchPatient: 'पुढे जाण्यासाठी तपशील भरा',
    searchPatientPlaceholder: 'मोबाइल क्रमांक किंवा रुग्ण आयडी', patientNotFound: 'स्थानिक रुग्ण नोंद सापडली नाही.',
    abhaAddress: 'ABHA पत्ता', notRegisteredYet: 'अजून नोंदणी केली नाही?', registerNow: 'आता नोंदणी करा', useDemoPatient: 'डेमो रुग्ण वापरा',
  },
  gu: {
    patientRegistration: 'દર્દી ચેક-ઇન', newRegistration: 'નવા દર્દીની નોંધણી', existingPatient: 'દર્દી લૉગિન',
    patientId: 'હોસ્પિટલ દર્દી આઈડી', enterAge: 'વર્ષોમાં ઉંમર', searchPatient: 'આગળ વધવા વિગતો દાખલ કરો',
    searchPatientPlaceholder: 'મોબાઇલ નંબર અથવા દર્દી આઈડી', patientNotFound: 'સ્થાનિક દર્દી રેકોર્ડ મળ્યો નથી.',
    abhaAddress: 'ABHA સરનામું', notRegisteredYet: 'હજુ નોંધણી નથી કરી?', registerNow: 'હવે નોંધણી કરો', useDemoPatient: 'ડેમો દર્દી વાપરો',
  },
  kn: {
    patientRegistration: 'ರೋಗಿ ಚೆಕ್-ಇನ್', newRegistration: 'ಹೊಸ ರೋಗಿ ನೋಂದಣಿ', existingPatient: 'ರೋಗಿ ಲಾಗಿನ್',
    patientId: 'ಆಸ್ಪತ್ರೆ ರೋಗಿ ಐಡಿ', enterAge: 'ವರ್ಷಗಳಲ್ಲಿ ವಯಸ್ಸು', searchPatient: 'ಮುಂದುವರಿಯಲು ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    searchPatientPlaceholder: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ರೋಗಿ ಐಡಿ', patientNotFound: 'ಸ್ಥಳೀಯ ರೋಗಿ ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ.',
    abhaAddress: 'ABHA ವಿಳಾಸ', notRegisteredYet: 'ಇನ್ನೂ ನೋಂದಾಯಿಸಿಲ್ಲವೇ?', registerNow: 'ಈಗ ನೋಂದಾಯಿಸಿ', useDemoPatient: 'ಡೆಮೊ ರೋಗಿಯನ್ನು ಬಳಸಿ',
  },
  pa: {
    patientRegistration: 'ਮਰੀਜ਼ ਚੈੱਕ-ਇਨ', newRegistration: 'ਨਵੇਂ ਮਰੀਜ਼ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', existingPatient: 'ਮਰੀਜ਼ ਲੌਗਇਨ',
    patientId: 'ਹਸਪਤਾਲ ਮਰੀਜ਼ ਆਈਡੀ', enterAge: 'ਉਮਰ ਸਾਲਾਂ ਵਿੱਚ', searchPatient: 'ਅੱਗੇ ਵਧਣ ਲਈ ਵੇਰਵੇ ਭਰੋ',
    searchPatientPlaceholder: 'ਮੋਬਾਈਲ ਨੰਬਰ ਜਾਂ ਮਰੀਜ਼ ਆਈਡੀ', patientNotFound: 'ਸਥਾਨਕ ਮਰੀਜ਼ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ।',
    abhaAddress: 'ABHA ਪਤਾ', notRegisteredYet: 'ਹਾਲੇ ਰਜਿਸਟਰ ਨਹੀਂ ਹੋਏ?', registerNow: 'ਹੁਣੇ ਰਜਿਸਟਰ ਕਰੋ', useDemoPatient: 'ਡੈਮੋ ਮਰੀਜ਼ ਵਰਤੋ',
  },
  ml: {
    patientRegistration: 'രോഗി ചെക്ക്-ഇൻ', newRegistration: 'പുതിയ രോഗി രജിസ്ട്രേഷൻ', existingPatient: 'രോഗി ലോഗിൻ',
    patientId: 'ആശുപത്രി രോഗി ഐഡി', enterAge: 'വയസ്സ് വർഷങ്ങളിൽ', searchPatient: 'തുടരാൻ വിവരങ്ങൾ നൽകുക',
    searchPatientPlaceholder: 'മൊബൈൽ നമ്പർ അല്ലെങ്കിൽ രോഗി ഐഡി', patientNotFound: 'പ്രാദേശിക രോഗി രേഖ കണ്ടെത്തിയില്ല.',
    abhaAddress: 'ABHA വിലാസം', notRegisteredYet: 'ഇതുവരെ രജിസ്റ്റർ ചെയ്തിട്ടില്ലേ?', registerNow: 'ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക', useDemoPatient: 'ഡെമോ രോഗിയെ ഉപയോഗിക്കുക',
  },
}

export default coreUiTranslations
