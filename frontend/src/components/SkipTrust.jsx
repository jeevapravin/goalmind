export default function SkipTrust({ answers, skippedIds, questions, onEdit, onRun }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-2xl p-4 fade-in'>
      <p className='text-xs text-slate-500 uppercase tracking-widest mb-3'>
        Context summary before running
      </p>
      <div className='space-y-2 mb-4'>
        {questions.map(q => {
          const wasSkipped = skippedIds?.includes(q.id);
          return (
            <div key={q.id}
              className={`flex justify-between items-center px-3 py-2 rounded-lg
                ${wasSkipped ? 'bg-slate-800/50' : 'bg-violet-900/20'}`}>
              <div>
                <p className={`text-xs ${wasSkipped ? 'text-slate-500' : 'text-slate-400'}`}>
                  {q.question}
                </p>
                <p className={`text-sm font-medium ${wasSkipped ? 'text-slate-500' : 'text-white'}`}>
                  {answers?.[q.id]}
                  {wasSkipped && <span className='text-xs ml-2 text-slate-600'>(assumed)</span>}
                </p>
              </div>
              {wasSkipped && (
                <button onClick={() => onEdit?.(q.id)}
                  className='text-xs text-violet-400 hover:text-violet-300'>Edit</button>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={onRun}
        className='w-full py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl
          text-white font-semibold text-sm transition-colors'>
        Run GoalMind →
      </button>
    </div>
  );
}
