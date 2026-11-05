'use client';
import { useState } from 'react';
const OPT = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];
const Q = [
  'Feeling nervous, anxious or on edge', 'Not being able to stop or control worrying',
  'Little interest or pleasure in doing things', 'Feeling down, depressed or hopeless',
  'Thoughts that you would be better off dead, or of hurting yourself', // item 9 style, safety flag
];

// PHQ-4 (Q1-4, 0-12): 0-2 -> T1, 3-5 -> T2, 6-8 -> T3, 9-12 -> T3 + crisis. Q5 > 0 -> T3 + crisis.
export function route(a) {
  const score = a.slice(0, 4).reduce((x, y) => x + y, 0), self = a[4] > 0;
  if (self || score >= 9) return { score, self, tier: 3, crisis: true };
  return { score, self, tier: score >= 6 ? 3 : score >= 3 ? 2 : 1, crisis: false };
}

export default function Triage({ onDone }) {
  const [a, setA] = useState(Array(5).fill(null));
  const done = a.every((x) => x !== null);
  return (
    <div className="card max-w-xl mx-auto">
      <h2 className="font-display text-2xl">A quick check-in</h2>
      <p className="text-sm mb-4">Over the last 2 weeks, how often have you been bothered by: <span className="text-ink/60">(pichhle 2 hafton mein)</span></p>
      {Q.map((q, i) => (
        <fieldset key={i} className="mb-4"><legend className="font-semibold mb-1">{q}</legend>
          <div className="grid grid-cols-2 gap-2">
            {OPT.map((o, v) => (
              <label key={v} className={`btn-s text-sm cursor-pointer ${a[i] === v ? '!bg-teal-soft !border-teal' : ''}`}>
                <input type="radio" className="sr-only" name={`q${i}`} onChange={() => setA(a.map((x, j) => j === i ? v : x))} />{o}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <button className="btn-p w-full" disabled={!done} onClick={() => onDone(route(a))}>See my matches</button>
    </div>
  );
}
