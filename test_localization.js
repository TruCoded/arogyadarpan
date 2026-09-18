import fs from 'node:fs'
import path from 'node:path'
import translations from './src/data/translations.js'
import coreUiTranslations from './src/data/coreUiTranslations.js'
import journeyTranslations from './src/data/journeyTranslations.js'
import supplementalTranslations from './src/data/supplementalTranslations.js'
import { COMPLAINT_OPTIONS, SOCRATES_QUESTIONS, DASHAVIDHA_PARIKSHA_QUESTIONS, COMMON_HISTORY_QUESTIONS, ADAPTIVE_BRANCHING_QUESTIONS, getLocalizedQuestion } from './src/data/questionBank.js'

const languages = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'pa', 'ml']
const targets = ['src/pages/LandingPage.jsx', 'src/pages/patient', 'src/components/StitchAppHeader.jsx', 'src/components/LanguageSelector.jsx', 'src/components/VoiceRecorder.jsx', 'src/components/TouchNumericKeypad.jsx', 'src/components/TouchDatePicker.jsx', 'src/components/SessionTimeoutModal.jsx', 'src/components/kiosk/BionicKioskShell.jsx']

const collectFiles = (target) => fs.statSync(target).isDirectory()
  ? fs.readdirSync(target).flatMap((entry) => collectFiles(path.join(target, entry)))
  : [target]

const usedKeys = new Set()
for (const file of targets.flatMap(collectFiles)) {
  const source = fs.readFileSync(file, 'utf8')
  for (const match of source.matchAll(/\bt\(['"]([^'"]+)/g)) usedKeys.add(match[1])
}

let failures = 0
for (const language of languages) {
  const dictionaries = [translations[language], coreUiTranslations[language], journeyTranslations[language], supplementalTranslations[language]]
  const missing = [...usedKeys].filter((key) => !dictionaries.some((dictionary) => dictionary && key in dictionary))
  if (missing.length) { failures += missing.length; console.error(`${language}: missing UI keys: ${missing.join(', ')}`) }
}

for (const language of languages.slice(1)) {
  for (const complaint of COMPLAINT_OPTIONS) {
    if (!complaint.labels?.[language]) { failures += 1; console.error(`${language}: missing complaint ${complaint.id}`) }
  }
}

const questions = [...Object.values(SOCRATES_QUESTIONS).flat(), ...DASHAVIDHA_PARIKSHA_QUESTIONS, ...COMMON_HISTORY_QUESTIONS, ...ADAPTIVE_BRANCHING_QUESTIONS]
for (const language of languages.slice(1)) {
  for (const question of questions) {
    if (getLocalizedQuestion(question, language) === question.question) { failures += 1; console.error(`${language}: untranslated question ${question.id}`) }
  }
}

if (failures) {
  console.error(`Localization audit failed with ${failures} issue(s).`)
  process.exit(1)
}

console.log(`Localization audit passed: ${languages.length} languages, ${usedKeys.size} UI keys, ${questions.length} question entries.`)
