const MUTATIONS = [
  { key: 'skeptical',  label: '😈 More Skeptical',  color: 'border-red-600/40 hover:border-red-500' },
  { key: 'financial',  label: '💰 Add Financials',  color: 'border-green-600/40 hover:border-green-500' },
  { key: 'vc_lens',    label: '🏦 VC Lens',         color: 'border-blue-600/40 hover:border-blue-500' },
  { key: 'simplify',   label: '🧸 Simplify',        color: 'border-amber-600/40 hover:border-amber-500' },
];

export default function MutationBar({ onMutate, isLoading }) {
  return (
    <div className='mt-6 pt-4 border-t border-slate-800'>
      <p className='text-xs text-slate-500 mb-3'>Reframe this report:</p>
      <div className='flex flex-wrap gap-2'>
        {MUTATIONS.map(m => (
          <button key={m.key}
            onClick={() => onMutate(m.key)}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-xl border text-xs text-slate-300
              hover:text-white transition-all disabled:opacity-40
              ${m.color}`}>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
