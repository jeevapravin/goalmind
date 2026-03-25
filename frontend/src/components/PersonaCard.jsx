export default function PersonaCard({ data, onDismiss }) {
  if (!data) return null;
  const colors = {
    student:   'border-blue-500/40 bg-blue-900/20',
    maker:     'border-teal-500/40 bg-teal-900/20',
    founder:   'border-violet-500/40 bg-violet-900/20',
    executive: 'border-amber-500/40 bg-amber-900/20'
  };
  return (
    <div className={`rounded-2xl border p-4 mb-4 fade-in ${colors[data.persona] || 'border-slate-700 bg-slate-900'}`}>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-xs font-semibold uppercase tracking-widest text-slate-400'>
          GoalMind detected
        </span>
        <button onClick={onDismiss} className='text-slate-600 hover:text-slate-400 text-xs'>
          dismiss
        </button>
      </div>
      <p className='text-white font-semibold text-sm mb-3'>
        {data.persona.charAt(0).toUpperCase() + data.persona.slice(1)} &middot;{' '}
        {Math.round(data.confidence * 100)}% confidence
      </p>
      <div className='flex flex-wrap gap-2'>
        {data.signals?.map((s, i) => (
          <div key={i} className='group relative'>
            <span className='px-2 py-1 rounded-lg bg-slate-800 text-xs text-violet-300
              cursor-help border border-slate-700'>
              &ldquo;{s.phrase}&rdquo;
            </span>
            <div className='hidden group-hover:block absolute bottom-full left-0 mb-1
              bg-slate-800 border border-slate-600 rounded-lg px-3 py-2
              text-xs text-slate-300 w-48 z-10 shadow-xl'>
              {s.implication}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
