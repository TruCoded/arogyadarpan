import { useState, useMemo } from 'react'

const DEFAULT_TIMELINE_EVENTS = [
  {
    id: 'tl-1',
    category: 'diagnoses',
    dateLabel: 'TODAY — MARCH 2026',
    statusBadge: 'ACTIVE INTAKE',
    statusBadgeColor: 'bg-red-50 text-red-600 border border-red-200',
    icon: 'ecg_heart',
    iconColor: 'text-[#00855b]',
    beaconPing: true,
    title: "Today’s Chief Complaint: Acute Chest Pain",
    subtitle: "Current Voice & Sensor Intake In-Progress",
    alertIcon: 'crisis_alert',
    alertColor: 'text-amber-500',
    symptomCluster: "Retrosternal pressure radiating to left arm, 2-day duration. Intensifies on exertion.",
    doctor: "Dr. Ananya Sharma",
    clinic: "General Medicine OP #4",
    vitals: [
      { label: 'SPO2 SATURATION', value: '97% Room Air' },
      { label: 'TRIAGE LEVEL', value: 'Urgent Priority 2', alert: true },
    ],
    note: "Stat troponin test queued via District Hospital Laboratory interface."
  },
  {
    id: 'tl-2',
    category: 'labs',
    secondaryCat: 'prescriptions',
    dateLabel: 'OCTOBER 2025',
    statusBadge: 'METABOLIC PANEL',
    statusBadgeColor: 'bg-cyan-50 text-cyan-800 border border-cyan-200',
    icon: 'bloodtype',
    iconColor: 'text-cyan-600',
    title: "Type 2 Diabetes Mellitus Diagnosis & Metformin Started",
    subtitle: "Prescribed: Metformin 500mg BID with meals",
    hasSparkline: true,
    hba1c: '8.4%',
    doctor: "City Endocrinology Center",
    abhaLinked: true,
    note: "Lifestyle intervention plan formulated: 30 minutes brisk walking daily, low-glycemic dietary restriction. Next follow-up fasting glucose scheduled in 90 days.",
    rxCode: "Rx #END-899120 • 60 Tablets Dispensed"
  },
  {
    id: 'tl-3',
    category: 'allergies',
    dateLabel: 'MARCH 2024',
    statusBadge: 'SAFETY ALERT',
    statusBadgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: 'shield',
    iconColor: 'text-amber-600',
    title: "Allergic Reaction Documented: Penicillin Rash",
    subtitle: "High-Alert Drug Hypersensitivity Entry",
    alertIcon: 'warning',
    alertColor: 'text-amber-600',
    symptomCluster: "Generalized urticaria and facial erythema following Amoxicillin 500mg oral dose. Resolved with antihistamines.",
    doctor: "City Civil Hospital Casualty",
    note: "Penicillin class antibiotics strictly contraindicated. Added to National Digital Health Registry."
  },
  {
    id: 'tl-4',
    category: 'diagnoses',
    dateLabel: 'AUGUST 2023',
    statusBadge: 'SURGICAL RECORD',
    statusBadgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    icon: 'medical_services',
    iconColor: 'text-teal-700',
    title: "Laparoscopic Appendectomy",
    subtitle: "Uncomplicated surgical excision; full wound healing achieved",
    doctor: "Apex Surgical Center",
    abhaLinked: true,
    note: "Histopathology confirmed acute suppurative appendicitis with clear margins. Discharged on postoperative Day 2."
  }
]

export default function Timeline({ events = [], className = '' }) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [expandedItems, setExpandedItems] = useState({ 'tl-1': true })

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Merge custom events with default enriched clinical events
  const allEvents = useMemo(() => {
    if (!events || events.length === 0) return DEFAULT_TIMELINE_EVENTS
    // Map custom events into timeline format
    const customFormatted = events.map((e, idx) => ({
      id: e.id || `custom-${idx}`,
      category: e.eventType === 'investigation' ? 'labs' : (e.eventType === 'medication' ? 'prescriptions' : 'diagnoses'),
      dateLabel: e.date ? new Date(e.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }).toUpperCase() : 'RECENT',
      statusBadge: (e.eventType || 'RECORD').toUpperCase(),
      statusBadgeColor: 'bg-teal-50 text-teal-800 border border-teal-200',
      icon: e.eventType === 'medication' ? 'pill' : (e.eventType === 'investigation' ? 'biotech' : 'stethoscope'),
      iconColor: 'text-teal-700',
      title: e.title,
      subtitle: e.description || 'Verified via patient health repository',
      doctor: e.doctor || 'Attending Physician',
      abhaLinked: true
    }))
    return [...DEFAULT_TIMELINE_EVENTS, ...customFormatted]
  }, [events])

  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'all') return allEvents
    return allEvents.filter(e => e.category === selectedFilter || e.secondaryCat === selectedFilter)
  }, [allEvents, selectedFilter])

  return (
    <div className={`flex flex-col w-full gap-4 ${className}`}>
      {/* Header Block */}
      <section className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/80">
            <span className="material-symbols-outlined text-[14px]">history_edu</span>
            <span className="font-mono text-[10px] font-bold tracking-wider">FHIR R4 • ABDM LIVE</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00855b] animate-ping" />
            <span>SYNCED 2M AGO</span>
          </div>
        </div>

        <div className="flex flex-col mt-1">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Your Longitudinal Health Story
          </h2>
          <span className="text-xs font-semibold text-teal-700">
            स्वास्थ्य इतिहास एवं संपूर्ण नैदानिक यात्रा
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Unified record synchronized via Ayushman Bharat Digital Mission (<span className="font-mono text-[11px] font-bold text-teal-700">ABHA: 91-8842-1920-4491</span>).
        </p>
      </section>

      {/* Horizontal Scrolling Category Pills */}
      <div className="relative -mx-2 px-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span>All Events ({allEvents.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('diagnoses')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'diagnoses'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">stethoscope</span>
            <span>Diagnoses</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('prescriptions')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'prescriptions'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">prescriptions</span>
            <span>Prescriptions</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('labs')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'labs'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">monitoring</span>
            <span>Lab Trends</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('allergies')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'allergies'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span>Allergies & Alerts</span>
          </button>
        </div>
      </div>

      {/* Micro Summary Insight Banner */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#006947] shrink-0">
            <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-slate-900">3 Active Care Pathways</p>
            <p className="text-xs text-slate-500">Cardiology, Endocrine & Preventive</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
      </div>

      {/* Vertical Glowing Timeline Architecture */}
      <div className="relative mt-2 pl-7 flex flex-col gap-6">
        {/* Continuous Vertical Luminous Teal Guide Line */}
        <div className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-teal-700 via-cyan-400 to-slate-200 pointer-events-none shadow-[0_0_12px_rgba(0,104,95,0.4)]" />

        {filteredEvents.map((item) => {
          const isExpanded = !!expandedItems[item.id]
          return (
            <div key={item.id} className="relative flex flex-col gap-2">
              {/* Pulsing Beacon Node */}
              <div className="absolute -left-7 top-1 w-7 h-7 flex items-center justify-center">
                {item.beaconPing && (
                  <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                )}
                <div className="relative w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-200">
                  <span className={`material-symbols-outlined text-[15px] ${item.iconColor}`}>
                    {item.icon}
                  </span>
                </div>
              </div>

              {/* Timestamp & Status Pill */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-teal-800 font-bold tracking-wider">
                  {item.dateLabel}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] tracking-wide font-bold flex items-center gap-1 ${item.statusBadgeColor}`}>
                  {item.beaconPing && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  {item.statusBadge}
                </span>
              </div>

              {/* Event Card (Frosted Glass Aesthetic) */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs flex flex-col gap-3 transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.subtitle}</p>
                  </div>
                  {item.alertIcon && (
                    <span className={`material-symbols-outlined text-[20px] ${item.alertColor}`}>
                      {item.alertIcon}
                    </span>
                  )}
                </div>

                {/* Symptom Cluster or Lab Metrics */}
                {item.symptomCluster && (
                  <div className="rounded-xl bg-slate-50 p-2.5 flex flex-col gap-1 border border-slate-100">
                    <span className="font-heading text-xs font-bold text-slate-800">Symptom Cluster:</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.symptomCluster}</p>
                  </div>
                )}

                {/* HbA1c Lab Sparkline if present */}
                {item.hasSparkline && (
                  <div className="rounded-xl bg-slate-50 p-3 flex flex-col gap-2 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-slate-500 uppercase font-bold">
                          Glycated Hemoglobin (HbA1c)
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono text-xl text-red-600 font-extrabold">{item.hba1c}</span>
                          <span className="text-xs text-red-600 font-semibold">(Elevated)</span>
                        </div>
                      </div>

                      {/* Sparkline Graphic */}
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">3-Point Trajectory</span>
                        <div className="w-28 h-7 flex items-end">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 28">
                            <polyline
                              fill="none"
                              points="5,22 50,13 95,4"
                              stroke="#dc2626"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                            />
                            <circle cx="5" cy="22" r="3" className="fill-white stroke-cyan-600" strokeWidth="2" />
                            <circle cx="50" cy="13" r="3" className="fill-white stroke-amber-500" strokeWidth="2" />
                            <circle cx="95" cy="4" r="3.5" className="fill-red-600 stroke-white" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div className="flex justify-between w-28 text-[9px] font-mono text-slate-400 mt-0.5">
                          <span>6.5%</span>
                          <span>7.8%</span>
                          <span className="text-red-600 font-bold">8.4%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Doctor Attribution Footer */}
                <div className="flex items-center justify-between pt-1 text-slate-600 text-xs border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-teal-700">clinical_notes</span>
                    <span className="font-medium text-slate-800">{item.doctor}</span>
                  </div>
                  {item.abhaLinked ? (
                    <span className="font-mono text-[10px] text-[#006947] font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">verified</span>ABHA-Linked
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-slate-400">{item.clinic || ''}</span>
                  )}
                </div>

                {/* Expandable Section */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-600 animate-fadeIn">
                    {item.vitals && (
                      <div className="grid grid-cols-2 gap-2">
                        {item.vitals.map((v, i) => (
                          <div key={i} className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                            <span className="font-mono text-[9px] text-slate-500 font-bold">{v.label}</span>
                            <p className={`font-mono text-xs font-bold ${v.alert ? 'text-red-600' : 'text-slate-800'}`}>
                              {v.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.note && <p className="italic text-slate-500 leading-relaxed">{item.note}</p>}
                    {item.rxCode && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-teal-50 text-teal-900 font-mono text-[11px]">
                        <span className="material-symbols-outlined text-[15px] text-teal-700">pill</span>
                        <span>{item.rxCode}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Expand / Collapse Button */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-mono text-xs font-bold self-start mt-0.5 cursor-pointer"
                >
                  <span>{isExpanded ? 'Collapse Details' : 'Expand Full Clinical Summary'}</span>
                  <span className={`material-symbols-outlined text-[16px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
