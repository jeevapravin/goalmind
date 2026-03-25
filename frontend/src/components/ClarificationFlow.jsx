import { useState } from 'react';
import SemanticSlider from './SemanticSlider';
import VisualContextCards from './VisualContextCards';

export default function ClarificationFlow({ questions, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState([]);

  if (!questions || questions.length === 0) {
    return null;
  }

  const q = questions[currentIdx];
  if (!q) return null;

  const isLast = currentIdx === questions.length - 1;

  const handleAnswer = (val) => {
    const updated = { ...answers, [q.id]: val };
    setAnswers(updated);
    if (isLast) onComplete(updated, skipped);
    else setCurrentIdx(i => i + 1);
  };

  const handleSkip = () => {
    const newSkipped = [...skipped, q.id];
    setSkipped(newSkipped);
    const updated = { ...answers, [q.id]: q.assumed_answer };
    setAnswers(updated);
    if (isLast) onComplete(updated, newSkipped);
    else setCurrentIdx(i => i + 1);
  };

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-2xl p-5 mb-4 fade-in'>
      <div className='flex items-center justify-between mb-1'>
        <p className='text-xs text-slate-500'>
          Question {currentIdx + 1} of {questions.length}
        </p>
        <button onClick={handleSkip}
          className='text-xs text-slate-500 hover:text-slate-300 transition-colors'>
          Let GoalMind decide →
        </button>
      </div>
      <p className='text-white font-medium text-sm mb-4'>{q.question}</p>

      {q.card_set_key ? (
        <VisualContextCards cardSetKey={q.card_set_key} onSelect={handleAnswer} />
      ) : q.type === 'spectrum' ? (
        <SemanticSlider anchors={q.spectrum_anchors} options={q.options}
          onSelect={handleAnswer} />
      ) : (
        <div className='grid grid-cols-2 gap-2'>
          {q.options?.map(opt => (
            <button key={opt} onClick={() => handleAnswer(opt)}
              className='px-3 py-2.5 rounded-xl border border-slate-700 text-sm
                text-slate-300 hover:border-violet-500 hover:text-white
                transition-colors text-left'>
              {opt}
            </button>
          ))}
        </div>
      )}

      {skipped.length > 0 && (
        <p className='text-xs text-teal-500 mt-3'>
          ✓ We filled in {skipped.length} question{skipped.length > 1 ? 's' : ''} for you
        </p>
      )}
    </div>
  );
}
