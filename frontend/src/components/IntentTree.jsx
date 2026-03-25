export default function IntentTree({ intent }) {
  if (!intent) return null;
  const rows = [
    { label: 'Surface Goal',     value: intent.surface_goal,     delay: '0ms',   color: 'text-slate-300' },
    { label: 'Underlying Need',  value: intent.underlying_need,  delay: '150ms', color: 'text-violet-300' },
    { label: 'Success Criteria', value: intent.success_criteria,  delay: '300ms', color: 'text-green-300' },
  ];
  return (
    <div className='bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-4'>
      <p className='text-xs text-slate-500 uppercase tracking-widest mb-3'>
        GoalMind understands
      </p>
      {rows.map((r, i) => (
        <div key={i} className='flex gap-3 mb-3 fade-in' style={{ animationDelay: r.delay }}>
          <div className='flex flex-col items-center'>
            <div className='w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0'/>
            {i < rows.length - 1 && <div className='w-px flex-1 bg-slate-700 mt-1'/>}
          </div>
          <div className='pb-2'>
            <p className='text-xs text-slate-500 mb-0.5'>{r.label}</p>
            <p className={`text-sm font-medium ${r.color}`}>{r.value}</p>
          </div>
        </div>
      ))}
      {intent.unstated_fears?.length > 0 && (
        <div className='mt-2 px-3 py-2 bg-amber-900/20 border border-amber-700/30 rounded-xl'>
          <p className='text-xs text-amber-400'>
            We also noticed: {intent.unstated_fears[0]}
          </p>
        </div>
      )}
    </div>
  );
}
