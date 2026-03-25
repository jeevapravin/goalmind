import { useState } from 'react';

export default function AssumptionEditor({ assumptions, onFlip, onConfirm }) {
  const [selected, setSelected] = useState({});

  if (!assumptions || assumptions.length === 0) return null;

  const handleFlip = (id, alt) => {
    const updated = { ...selected, [id]: alt };
    setSelected(updated);
    onFlip(updated); // triggers re-call in parent
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between mb-1'>
        <p className='text-xs text-slate-500 uppercase tracking-widest'>
          We assumed the following — flip any to adjust
        </p>
      </div>
      {assumptions.map(a => (
        <div key={a.id}
          className='bg-slate-900 border border-slate-700 rounded-xl p-3
            hover:border-violet-600/50 transition-colors'>
          <p className='text-xs text-slate-500 mb-1'>{a.category}</p>
          <p className='text-white text-sm font-medium mb-2'>
            {selected[a.id] || a.assumption}
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {a.alternatives?.map(alt => (
              <button key={alt}
                onClick={() => handleFlip(a.id, alt)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors
                  ${(selected[a.id] || a.assumption) === alt
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`
                }>
                {alt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => onConfirm(selected)}
        className='w-full mt-2 py-2.5 bg-violet-600 hover:bg-violet-500
          rounded-xl text-white text-sm font-semibold transition-colors'>
        Confirm &amp; Run Agent →
      </button>
    </div>
  );
}
