'use client';
import { useEffect, useRef, useState } from 'react';
import { Flag, Send, Video } from 'lucide-react';
import { sock } from '../lib/socket';
import { mask } from '../lib/mask';

export default function Chat({ role }) {
  const [msgs, setM] = useState([]), [txt, setT] = useState(''), [flagged, setF] = useState(false), [video, setV] = useState(false);
  const end = useRef();
  useEffect(() => {
    const s = sock(), onMsg = (m) => setM((a) => [...a, m]), onHist = (h) => setM(h), onFlag = () => setF(true);
    s.on('msg', onMsg); s.on('history', onHist); s.on('flag', onFlag); s.emit('sync');
    return () => { s.off('msg', onMsg); s.off('history', onHist); s.off('flag', onFlag); };
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [msgs]); // block body: effect must not return a value
  const send = (e) => { e.preventDefault(); if (!txt.trim()) return; sock().emit('msg', { from: role, text: mask(txt) }); setT(''); };
  return (
    <div className="card flex flex-col h-[28rem] !p-3">
      <div className="flex justify-between items-center pb-2 border-b border-sage/50">
        <span className="text-sm">Session room · open the other view in a second tab to chat both ways</span>
        <span className="flex gap-1">
          <button className="btn-s !p-2" onClick={() => setV(!video)} aria-label="Toggle video"><Video size={16} /></button>
          <button className="btn-s !p-2" disabled={flagged} onClick={() => { sock().emit('flag', { by: role, reason: 'inappropriate behaviour' }); }} aria-label="Report"><Flag size={16} /></button>
        </span>
      </div>
      {video && <div className="my-2 h-28 rounded-xl bg-ink text-white grid place-items-center text-sm">Simulated video call (no WebRTC in demo)</div>}
      {flagged && <p className="my-2 text-xs rounded-lg bg-sage-soft p-2">Report received. A temporary encrypted chat audit has been requested (simulated).</p>}
      <div className="flex-1 overflow-auto py-2 space-y-2">
        {msgs.map((m) => (
          <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === role ? 'ml-auto bg-teal text-white' : 'bg-sage-soft'}`}>{m.text}</div>
        ))}<div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input value={txt} onChange={(e) => setT(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-xl border border-sage px-3" />
        <button className="btn-p" aria-label="Send"><Send size={16} /></button>
      </form>
    </div>
  );
}
