import { useState } from 'react';

export default function SemanticSlider({ anchors, options, onSelect }) {
  const [val, setVal] = useState(0);

  if (!options || options.length === 0) return null;

  const step = Math.floor(100 / (options.length - 1));
  const idx = Math.min(Math.floor(val / (step || 1)), options.length - 1);
  
  return (
    <div className='px-1'>
      <input
        type='range' min='0' max='100' value={val}
        onChange={e => setVal(Number(e.target.value))}
        className='w-full accent-violet-500 cursor-pointer'
      />
      <div className='flex justify-between text-xs text-slate-500 mt-1 mb-3'>
        <span>{anchors?.[0]}</span>
        <span className='text-violet-400 font-medium'>{options[idx]}</span>
        <span>{anchors?.[1]}</span>
      </div>
      <button onClick={() => onSelect(options[idx])}
        className='w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-xl
          text-white text-sm font-semibold transition-colors'>
        Confirm: {options[idx]}
      </button>
    </div>
  );
}
