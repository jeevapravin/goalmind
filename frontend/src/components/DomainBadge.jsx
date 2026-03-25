const DOMAIN_STYLES = {
  startup_validation: 'bg-violet-900/40 text-violet-300 border-violet-500/30',
  market_research:    'bg-blue-900/40 text-blue-300 border-blue-500/30',
  career_decision:    'bg-teal-900/40 text-teal-300 border-teal-500/30',
  product_design:     'bg-orange-900/40 text-orange-300 border-orange-500/30',
  personal_finance:   'bg-green-900/40 text-green-300 border-green-500/30',
  content_strategy:   'bg-pink-900/40 text-pink-300 border-pink-500/30',
};

export default function DomainBadge({ domain, label }) {
  if (!domain) return null;
  return (
    <span className={`px-3 py-1 rounded-full border text-xs font-semibold
      ${DOMAIN_STYLES[domain] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
      {label}
    </span>
  );
}
