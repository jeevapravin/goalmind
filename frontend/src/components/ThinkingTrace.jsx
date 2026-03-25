import { useEffect, useRef, useState } from 'react';

export default function ThinkingTrace({ goal, currentStep, isActive }) {
  const [tokens, setTokens] = useState('');
  const [open, setOpen] = useState(true);
  const ref = useRef(null);
  const srcRef = useRef(null);

  useEffect(() => {
    if (!isActive || !currentStep) return;
    setTokens('');

    // Close any previous connection
    if (srcRef.current) {
      srcRef.current.close();
      srcRef.current = null;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const url = `${backendUrl}/api/thinking/stream?goal=${encodeURIComponent(goal)}&step=${encodeURIComponent(currentStep)}`;
    const src = new EventSource(url);
    srcRef.current = src;

    src.onmessage = e => {
      try {
        const d = JSON.parse(e.data);
        if (d.done) { src.close(); return; }
        setTokens(t => t + (d.token || ''));
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
      } catch (err) {
        console.error('Thinking trace parse error:', err);
      }
    };

    src.onerror = () => {
      src.close();
    };

    return () => {
      src.close();
      srcRef.current = null;
    };
  }, [currentStep, isActive, goal]);

  if (!isActive && !tokens) return null;

  return (
    <>
      <div className={`fixed right-0 top-0 h-screen w-80 bg-slate-950 border-l
        border-slate-800 z-40 transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex items-center justify-between px-4 py-3 border-b border-slate-800'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse'/>
            <span className='text-xs text-slate-400 font-mono'>thinking trace</span>
          </div>
          <button onClick={() => setOpen(false)}
            className='text-slate-600 hover:text-slate-400 text-xs'>hide</button>
        </div>
        <div ref={ref}
          className='p-4 h-full overflow-y-auto font-mono text-xs text-green-400/80
            leading-relaxed whitespace-pre-wrap pb-20'>
          {tokens}
          {isActive && <span className='animate-pulse'>▋</span>}
        </div>
      </div>
      {!open && (
        <button onClick={() => setOpen(true)}
          className='fixed right-4 top-1/2 -translate-y-1/2 bg-slate-900
            border border-slate-700 p-2 rounded-lg text-xs text-slate-400 z-50'>
          🧠
        </button>
      )}
    </>
  );
}
