import { Mic, MicOff, Sparkles } from 'lucide-react'

export default function VoiceRecorder({
  isListening = false,
  isSupported = true,
  transcript = '',
  interimTranscript = '',
  onStart,
  onStop,
  error,
  className = '',
}) {
  if (!isSupported) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <MicOff className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">
          Voice input is not supported in this browser.
        </p>
      </div>
    )
  }

  const displayText = transcript || interimTranscript

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Stitch Live Transcript Speech Bubble */}
      <div className="w-full max-w-sm mb-4 relative rounded-2xl bg-white p-3.5 shadow-md border border-slate-200/80 transition-all">
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-teal-600'}`} />
            <span className="font-mono text-[11px] font-bold text-slate-600">Live Voice Intake (Hindi/EN)</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-mono text-[10px] font-bold">
            <Sparkles className="size-3" />
            98% match
          </span>
        </div>
        <p className="text-sm text-slate-800 italic leading-relaxed mt-2 min-h-[2.5rem] flex items-center">
          {displayText ? (
            <span>“{displayText}”</span>
          ) : (
            <span className="text-slate-400 not-italic">“Tap mic and speak your symptoms in your own words...”</span>
          )}
        </p>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-200/80" />
      </div>

      {/* Central 72px Stitch Pulsing Microphone with Concentric Rings */}
      <div className="relative flex items-center justify-center my-2">
        {isListening && (
          <>
            <div className="absolute w-28 h-28 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
            <div className="absolute w-24 h-24 rounded-full bg-teal-500/30 animate-pulse pointer-events-none" />
          </>
        )}

        <button
          type="button"
          onClick={isListening ? onStop : onStart}
          className={`
            relative w-[72px] h-[72px] rounded-full flex items-center justify-center
            shadow-xl active:scale-95 transition-all duration-300 cursor-pointer
            ${isListening
              ? 'bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 text-white ring-4 ring-teal-500/30 shadow-teal-glow'
              : 'bg-white hover:bg-slate-50 text-teal-700 border-2 border-teal-500/30 hover:border-teal-500'
            }
          `}
          aria-label={isListening ? 'Stop recording' : 'Start recording'}
        >
          <Mic className={`w-8 h-8 ${isListening ? 'animate-pulse' : ''}`} />

          {/* Live recording mini ping badge */}
          {isListening && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500" />
            </span>
          )}
        </button>
      </div>

      {/* Status Instruction Bar */}
      <div className="flex items-center gap-2 mt-2">
        <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-emerald-500 animate-bounce' : 'bg-slate-400'}`} />
        <span className="font-mono text-[11px] text-slate-500">
          {isListening ? 'Listening... Tap mic to pause' : 'Tap mic to speak naturally in any dialect'}
        </span>
      </div>

      {/* Error state */}
      {error === 'microphone_blocked' && (
        <p className="mt-3 text-xs text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full border border-red-200">
          Microphone access blocked. Please enable in browser permissions.
        </p>
      )}
    </div>
  )
}
