'use client';
import { useEffect, useState } from 'react';
import { Phone, X, LifeBuoy } from 'lucide-react';

// 4-7-8 paced breathing: [label, seconds, circle scale]
const PH = [['Breathe in', 4, 1], ['Hold', 7, 1], ['Breathe out', 8, 0.5]];

export function Breathing() {
  const [s, setS] = useState({ i: 0, n: 4 });
  useEffect(() => {
    const t = setInterval(() => setS(({ i, n }) => n > 1 ? { i, n: n - 1 } : { i: (i + 1) % 3, n: PH[(i + 1) % 3][1] }), 1000);
    return () => clearInterval(t);
  }, []);
  const [label, dur, scale] = PH[s.i];
  return (
    <div className="flex flex-col items-center py-4" aria-live="polite">
      <div className="h-36 w-36 rounded-full bg-teal/30 grid place-items-center">
        <div className="h-36 w-36 rounded-full bg-teal text-white grid place-items-center text-3xl font-display"
          style={{ transform: `scale(${scale})`, transition: `transform ${dur}s ease-in-out` }}>{s.n}</div>
      </div>
      <p className="mt-3 font-display text-xl">{label}</p>
      <p className="text-xs text-ink/60">4-7-8 breathing · saans andar 4, roken 7, bahar 8</p>
    </div>
  );
}

export function CrisisButton({ onClick }) {
  return (
    <button onClick={onClick} className="fixed bottom-4 right-4 z-40 btn bg-alert text-white shadow-lg flex items-center gap-2 text-left">
      <LifeBuoy size={18} /><span className="leading-tight">Need Emergency Help?<br /><small className="font-normal">Emergency madad ke liye yahan click karein</small></span>
    </button>
  );
}

export function CrisisCard({ onClose }) {
  const Dial = ({ n, tel, l }) => (
    <a href={`tel:${tel}`} className="btn-p flex items-center justify-between gap-2"><span className="flex items-center gap-2"><Phone size={16} />{l}</span><b>{n}</b></a>
  );
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-3">
      <div className="card max-w-md w-full max-h-[92vh] overflow-auto">
        <div className="flex justify-between"><h2 className="font-display text-2xl">You are not alone</h2><button onClick={onClose} aria-label="Close"><X /></button></div>
        <p className="text-sm mb-3">Free, 24x7 help. Tap to call. / Abhi call karein, madad muft hai.</p>
        <div className="grid gap-2">
          <Dial l="Tele-MANAS" n="14416" tel="14416" />
          <Dial l="Tele-MANAS (toll-free)" n="1800-891-4416" tel="18008914416" />
          <Dial l="National Emergency" n="112" tel="112" />
        </div>
        <Breathing />
      </div>
    </div>
  );
}
