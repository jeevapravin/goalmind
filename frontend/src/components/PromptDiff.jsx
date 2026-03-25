import { useState } from 'react';

export default function PromptDiff({ rawInput, enrichedPrompt }) {
  const [open, setOpen] = useState(false);

  if (!rawInput || !enrichedPrompt) return null;

  const rawWords = rawInput.split(' ').length;
  const enrichedWords = enrichedPrompt.split(' ').length;

  return (
    <div className='mt-4'>
      <button onClick={() => setOpen(o => !o)}
        className='text-xs text-slate-500 hover:text-violet-400 transition-colors
          flex items-center gap-1'>
        {open ? '▲' : '▼'} View how GoalMind understood your request
        <span className='ml-2 bg-violet-900/40 text-violet-300 px-2 py-0.5 rounded-full'>
          {rawWords} words → {enrichedWords} words
        </span>
      </button>
      {open && (
        <div className='mt-3 grid grid-cols-2 gap-3 fade-in'>
          <div className='bg-slate-900 border border-slate-800 rounded-xl p-3'>
            <p className='text-xs text-slate-600 mb-2'>Your input</p>
            <p className='text-sm text-slate-500 leading-relaxed'>{rawInput}</p>
          </div>
          <div className='bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-y-auto
            max-h-48'>
            <p className='text-xs text-teal-500 mb-2'>Enriched context</p>
            <p className='text-xs text-teal-300/70 leading-relaxed font-mono'>
              {enrichedPrompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
