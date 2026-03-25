import { useState } from 'react';

const CARD_SETS = {
  business_model: [
    { value: 'B2C', icon: '👤', desc: 'Sell direct to consumers' },
    { value: 'B2B SaaS', icon: '🏢', desc: 'Software sold to businesses' },
    { value: 'Marketplace', icon: '🔄', desc: 'Connect buyers and sellers' },
    { value: 'D2C', icon: '📦', desc: 'Brand direct to consumer' },
  ],
  market_geography: [
    { value: 'India Tier-1', icon: '🏙', desc: 'Metro cities' },
    { value: 'India Tier-2/3', icon: '🏘', desc: 'Smaller cities & towns' },
    { value: 'Southeast Asia', icon: '🌏', desc: 'SG, MY, ID, TH, PH' },
    { value: 'Global', icon: '🌍', desc: 'No geo constraint' },
  ],
  user_type: [
    { value: 'Consumers', icon: '🧑', desc: 'Everyday people' },
    { value: 'Students', icon: '🎓', desc: 'College / school' },
    { value: 'SMBs', icon: '🏪', desc: 'Small businesses' },
    { value: 'Enterprises', icon: '🏦', desc: 'Large companies' },
  ],
  product_stage: [
    { value: 'Idea only', icon: '💡', desc: 'Nothing built yet' },
    { value: 'MVP built', icon: '🛠', desc: 'Basic product exists' },
    { value: 'Live with users', icon: '🚀', desc: 'Active users' },
    { value: 'Revenue stage', icon: '💰', desc: 'Paying customers' },
  ],
  funding_stage: [
    { value: 'Bootstrapped', icon: '💵', desc: 'Self-funded' },
    { value: 'Pre-seed', icon: '🌱', desc: 'Raising first round' },
    { value: 'Seed', icon: '📈', desc: '$500K–$2M range' },
    { value: 'Series A+', icon: '🏆', desc: 'Institutional capital' },
  ],
  content_platform: [
    { value: 'LinkedIn', icon: '💼', desc: 'Professional audience' },
    { value: 'Instagram', icon: '📸', desc: 'Visual / lifestyle' },
    { value: 'YouTube', icon: '▶️', desc: 'Long-form video' },
    { value: 'Newsletter', icon: '📧', desc: 'Direct to inbox' },
  ],
};

export default function VisualContextCards({ cardSetKey, onSelect }) {
  const cards = CARD_SETS[cardSetKey];
  const [selected, setSelected] = useState(null);

  if (!cards) return null;

  return (
    <div className='grid grid-cols-2 gap-2.5'>
      {cards.map(c => (
        <button key={c.value}
          onClick={() => { setSelected(c.value); onSelect(c.value); }}
          className={`p-3 rounded-xl border text-left transition-all relative
            ${selected === c.value
              ? 'border-violet-500 bg-violet-900/30 ring-1 ring-violet-500'
              : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`
          }>
          <div className='text-xl mb-1'>{c.icon}</div>
          <p className='text-sm font-semibold text-white'>{c.value}</p>
          <p className='text-xs text-slate-500 mt-0.5'>{c.desc}</p>
          {selected === c.value && (
            <span className='absolute top-2 right-2 text-violet-400 text-xs'>✓</span>
          )}
        </button>
      ))}
    </div>
  );
}
