'use client';
import { useEffect, useRef, useState } from 'react';
import { Flag, Send, Video, ShieldAlert } from 'lucide-react';
import { sock } from '../lib/socket';
import { moderate } from '../lib/moderate';

export default function Chat({ role, room }) {
  const [msgs, setM] = useState([]), [txt, setT] = useState(''), [flagged, setF] = useState(false), [video, setV] = useState(false), [alertOn, setA] = useState(false);
  const end = useRef();
  useEffect(() => {
    const s = sock();
    const onMsg = (m) => setM((a) => [...a, m]), onHist = (h) => setM(h), onFlag = () => setF(true);
    const onCrisis = (c) => { if (role === 'provider' && c.by === 'auto') setA(true); };
    s.on('msg', onMsg); s.on('history', onHist); s.on('flag', onFlag); s.on('crisis', onCrisis);
    s.emit('join', { room, role });
    return () => { s.off('msg', onMsg); s.off('history', onHist); s.off('flag', onFlag); s.off('crisis', onCrisis); };
  }, [room, role]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [msgs]);
  const send = (e) => {
    e.preventDefault(); if (!txt.trim()) return;
    const r = moderate(txt, role); // client-side moderation (1st layer)
    if (r.blocked) setM((a) => [...a, { id: Math.random(), from: role, text: r.text, blocked: true }]);
    else sock().emit('msg', { room, from: role, text: r.text });
    setT('');
  };
  return (
    <div className="card flex flex-col h-[28rem] !p-3">
      <div className="flex justify-between items-center pb-2 border-b border-sage/50">
        <span className="text-sm">You are: <b>{role}</b></span>
        <span className="flex gap-1">
          <button className="btn-s !p-2" onClick={() => setV(!video)} aria-label="Toggle video"><Video size={16} /></button>
          <button className="btn-s !p-2" disabled={flagged} onClick={() => sock().emit('flag', { room, by: role, reason: 'inappropriate behaviour' })} aria-label="Report"><Flag size={16} /></button>
        </span>
      </div>
      {video && <div className="my-2 h-28 rounded-xl bg-ink text-white grid place-items-center text-sm">Simulated video call (no WebRTC in demo)</div>}
      {flagged && <p className="my-2 text-xs rounded-lg bg-sage-soft p-2">Report received. A temporary encrypted chat audit has been requested (simulated).</p>}
      {alertOn && <p className="my-2 text-xs rounded-lg bg-red-50 border border-alert p-2 flex gap-2"><ShieldAlert size={16} />Safety alert: the client's message mentioned self-harm. Tele-MANAS card was shown to them. Check in with them now.</p>}
      <div className="flex-1 overflow-auto py-2 space-y-2">
        {msgs.map((m) => m.blocked
          ? <p key={m.id} className="text-xs text-alert text-center">{m.text}</p>
          : <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === role ? 'ml-auto bg-teal text-white' : 'bg-sage-soft'}`}>{m.text}</div>)}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input value={txt} onChange={(e) => setT(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-xl border border-sage px-3" />
        <button className="btn-p" aria-label="Send"><Send size={16} /></button>
      </form>
    </div>
  );
}
