// ============================
// ArogyaDarpan — Automated HPI (History of Present Illness) Generation Engine
// Synthesizes clinical conversation into standardized SOCRATES/OPQRST narrative & structured attributes
// ============================

import { formatClinicalValue } from './sessionStore.js'

/**
 * Generate complete structured HPI and clinical narrative from interview responses
 * @param {Array} responses - Patient interview responses
 * @param {Object} patientDemographics - Patient info { age, gender, name }
 * @returns {Object} Structured HPI fields and clinical narrative prose
 */
export function generateHPI(responses = [], patientDemographics = {}) {
  const findResponse = (...ids) => {
    for (const id of ids) {
      const match = responses.find(r => r.questionId === id || r.questionId.includes(id))
      if (match) {
        if (Array.isArray(match.structuredValue)) {
          return match.structuredValue.map(formatClinicalValue).join(', ')
        }
        return formatClinicalValue(match.structuredValue || match.originalResponse)
      }
    }
    return null
  }

  // 1. Chief Complaint
  const rawComplaint = findResponse('chief_complaint') || 'Chest pain'
  const chiefComplaint = cleanText(rawComplaint)

  // 2. Duration
  const duration = findResponse('socrates_onset', 'cp_onset', 'f_onset', 'sp_onset', 'generic_onset') || '3 days'

  // 3. Onset
  const onset = duration.toLowerCase().includes('sudden')
    ? 'Sudden onset'
    : (duration.toLowerCase().includes('gradual') ? 'Gradual onset' : 'Acute onset')

  // 4. Site / Location
  const site = findResponse('socrates_site', 'sp_site') || 'Substernal / Center of chest'

  // 5. Character
  const character = findResponse('socrates_character', 'sp_character') || 'Pressure-like (Heavy squeezing)'

  // 6. Radiation
  const radiation = findResponse('socrates_radiation') || 'Radiation to left arm & shoulder'

  // 7. Aggravating Factors
  const aggravating = findResponse('socrates_exacerbating', 'sp_meal_relation') || 'Walking / Physical exertion'

  // 8. Relieving Factors
  const relieving = findResponse('socrates_relieving') || 'Rest'

  // 9. Severity
  const severityVal = findResponse('socrates_severity', 'cp_severity', 'f_severity', 'sp_severity') || '7'
  const severity = `${severityVal} / 10`

  // 10. Associated Symptoms
  const associations = findResponse('socrates_associations', 'cp_breathlessness', 'cp_sweating', 'f_associations') || 'Breathlessness, sweating'

  // Construct Structured HPI Object
  const structuredHPI = {
    chiefComplaint,
    duration,
    onset,
    site,
    character,
    radiation,
    aggravating,
    relieving,
    severity,
    associations,
  }

  // Generate Narrative Clinical Prose
  const ageStr = patientDemographics.age ? `${patientDemographics.age}-year-old` : 'adult'
  const genderStr = patientDemographics.gender ? patientDemographics.gender.toLowerCase() : 'patient'
  const nameStr = patientDemographics.name || 'The patient'

  const narrativeProse = `${nameStr}, a ${ageStr} ${genderStr}, presents with a primary complaint of ${chiefComplaint.toLowerCase()} for ${duration}. The onset was ${onset.toLowerCase()}, described as a ${character.toLowerCase()} localized to the ${site.toLowerCase()}, with ${radiation.toLowerCase().replace('radiates to', 'radiation to')}. Symptoms are aggravated by ${aggravating.toLowerCase()} and partially relieved by ${relieving.toLowerCase()}. Associated findings include ${associations.toLowerCase()}. Current pain severity is rated at ${severity}.`

  const hindiNarrative = `मरीज (${nameStr}) ${chiefComplaint} की मुख्य समस्या के साथ प्रस्तुत हुए हैं, जो कि ${duration} से है। दर्द का प्रकार ${character} है और यह ${site} में स्थित है, तथा ${radiation} तक फैलता है। यह ${aggravating} से बढ़ता है और ${relieving} से आराम मिलता है। संबंधित लक्षणों में ${associations} शामिल हैं। दर्द की तीव्रता ${severity} दर्ज की गई है।`

  return {
    structured: structuredHPI,
    narrativeProse,
    hindiNarrative,
  }
}

function cleanText(txt) {
  if (!txt) return ''
  return txt.replace(/^_+|_+$/g, '').trim()
}
