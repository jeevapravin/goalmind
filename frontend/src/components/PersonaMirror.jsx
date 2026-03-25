import { useState } from 'react';

export default function PersonaMirror({ persona }) {
  const [open, setOpen] = useState(false);
  if (!persona) return null;
  return (
    <div className='mt-4'>
      <button onClick={() => setOpen(o => !o)}
        className='text-xs text-slate-500 hover:text-violet-400 transition-colors'>
        {open ? '▲' : '▼'} How GoalMind calibrated this for you
      </button>
      {open && (
        <div className='mt-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden fade-in'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='bg-slate-800'>
                <th className='text-left px-3 py-2 text-slate-400 font-medium'>Signal</th>
                <th className='text-left px-3 py-2 text-slate-400 font-medium'>Inference</th>
                <th className='text-left px-3 py-2 text-slate-400 font-medium'>Output adjustment</th>
              </tr>
            </thead>
            <tbody>
              {persona.signals?.map((s, i) => (
                <tr key={i} className='border-t border-slate-800'>
                  <td className='px-3 py-2 text-violet-300 font-mono'>
                    &ldquo;{s.phrase}&rdquo;</td>
                  <td className='px-3 py-2 text-slate-400'>{s.implication}</td>
                  <td className='px-3 py-2 text-teal-400'>
                    Tone: {persona.tone_adjustment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
