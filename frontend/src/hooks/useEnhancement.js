import { useState, useCallback } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const post = async (path, body) => {
  try {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      console.warn(`Enhancement API ${path} returned ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.warn(`Enhancement API ${path} failed:`, e);
    return null;
  }
};

// Small delay helper to stagger Gemini calls and avoid rate limits
const delay = (ms) => new Promise(r => setTimeout(r, ms));

export function useEnhancement() {
  const [stage, setStage] = useState('idle');
  // idle → detecting → clarifying → confirmed
  const [persona, setPersona] = useState(null);
  const [domain, setDomain] = useState(null);
  const [intent, setIntent] = useState(null);
  const [assumptions, setAssumptions] = useState([]);
  const [clarifications, setClarifications] = useState([]);
  const [entities, setEntities] = useState(null);
  const [enrichedPrompt, setEnrichedPrompt] = useState('');
  const [confirmedAnswers, setConfirmedAnswers] = useState({});
  const [skippedIds, setSkippedIds] = useState([]);
  const [rawGoal, setRawGoal] = useState('');

  const runEnhancement = useCallback(async (goal) => {
    setStage('detecting');
    setRawGoal(goal);

    // Stagger calls to avoid Gemini rate limits
    // Batch 1: persona + entities
    const [p, e] = await Promise.all([
      post('/api/enhance/persona', { goal }),
      post('/api/enhance/entities', { goal }),
    ]);
    
    await delay(500); // Small gap between batches

    // Batch 2: domain + intent
    const [d, i] = await Promise.all([
      post('/api/enhance/domain', { goal }),
      post('/api/enhance/intent', { goal }),
    ]);

    // Use results or fallbacks
    const personaData = p || { persona: 'founder', confidence: 0.5, signals: [], output_mode: 'dense', tone_adjustment: 'direct' };
    const entityData = e || { entity_context_string: goal, startup_name: null, market_description: '', location: '', numbers: [] };
    const domainData = d || { domain: 'startup_validation', label: 'Startup Validation', confidence: 0.5, framework_hint: '' };
    const intentData = i || { surface_goal: goal, underlying_need: '', success_criteria: '', unstated_fears: [] };

    setPersona(personaData); setDomain(domainData); setIntent(intentData); setEntities(entityData);

    await delay(500);

    // Fetch assumptions with persona
    const a = await post('/api/enhance/assumptions',
      { goal, persona: personaData.persona || 'founder' });
    const assumptionData = Array.isArray(a) ? a : [];
    setAssumptions(assumptionData);

    await delay(500);

    // Fetch clarifications
    const c = await post('/api/enhance/clarify',
      { goal, persona: personaData.persona || 'founder' });
    const clarifyData = Array.isArray(c) ? c : [];
    setClarifications(clarifyData);

    // Build enriched prompt string for diff view
    const enriched = [
      `PERSONA: ${personaData.persona || 'unknown'} (${personaData.tone_adjustment || 'default'})`,
      `DOMAIN: ${domainData.label || 'unknown'} — ${domainData.framework_hint || ''}`,
      `INTENT: ${intentData.underlying_need || ''}`,
      `SUCCESS CRITERIA: ${intentData.success_criteria || ''}`,
      `ENTITIES: ${entityData.entity_context_string || ''}`,
      `ASSUMPTIONS: ${assumptionData.map(x => x.assumption).join(', ')}`,
      `GOAL: ${goal}`,
    ].join('\n');
    setEnrichedPrompt(enriched);

    setStage(clarifyData.length > 0 ? 'clarifying' : 'confirmed');
  }, []);

  const handleClarificationComplete = useCallback((answers, skipped = []) => {
    setConfirmedAnswers(answers);
    setSkippedIds(skipped);
    setStage('confirmed');
  }, []);

  const confirmAnswers = useCallback((answers) => {
    setConfirmedAnswers(prev => ({ ...prev, ...answers }));
    setStage('confirmed');
  }, []);

  const buildContext = () => ({
    persona: persona?.persona,
    output_mode: persona?.output_mode,
    domain: domain?.domain,
    framework_hint: domain?.framework_hint,
    entity_context: entities?.entity_context_string,
    success_criteria: intent?.success_criteria,
    assumptions: (Array.isArray(assumptions) ? assumptions : []).map(a => a.assumption).join('; '),
    clarification_answers: confirmedAnswers,
  });

  const reset = useCallback(() => {
    setStage('idle');
    setPersona(null);
    setDomain(null);
    setIntent(null);
    setAssumptions([]);
    setClarifications([]);
    setEntities(null);
    setEnrichedPrompt('');
    setConfirmedAnswers({});
    setSkippedIds([]);
    setRawGoal('');
  }, []);

  return {
    stage, persona, domain, intent, assumptions, clarifications,
    entities, enrichedPrompt, confirmedAnswers, skippedIds, rawGoal,
    runEnhancement, handleClarificationComplete, confirmAnswers,
    buildContext, reset
  };
}
