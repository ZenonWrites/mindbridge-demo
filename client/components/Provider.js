'use client';
import { useState } from 'react';
import { ShieldAlert, Upload, ArrowUpRight } from 'lucide-react';
import Chat from './Chat';
import { sock } from '../lib/socket';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], HRS = ['10:00', '12:00', '16:00', '18:30'];
const ST = { Upcoming: 'bg-teal-soft', 'In Progress': 'bg-amber-100', Completed: 'bg-sage-soft' };

export default function Provider({ booking }) {
  const [tab, setTab] = useState('today'), [tier, setTier] = useState(1), [avail, setAvail] = useState({});
  const [notes, setNotes] = useState(''), [crisis, setCrisis] = useState(false), [sent, setSent] = useState(false);
  const [appts, setAppts] = useState([
    { id: 'a1', client: 'Isha (19)', slot: '09:00', status: 'Completed' },
    { id: 'a2', client: 'Dev (24)', slot: '11:00', status: 'In Progress' },
    ...(booking ? [{ id: booking.id, client: booking.client || 'Aarav (22)', slot: booking.slot, status: 'Upcoming', live: true }] : []),
  ]);
  const tabs = [['today', "Today"], ['profile', 'Profile & availability'], ['session', 'Live session']];
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-2 mb-3 flex-wrap">{tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`btn-s ${tab === k ? '!bg-teal-soft !border-teal' : ''}`}>{l}</button>)}</div>

      {tab === 'today' && <div className="space-y-3">
        {appts.map((a) => (
          <div key={a.id} className="card flex justify-between items-center gap-2">
            <div><b>{a.client}</b> · {a.slot} <span className={`tag ${ST[a.status]}`}>{a.status}</span></div>
            {a.live && <button className="btn-p" onClick={() => { setAppts(appts.map((x) => x.id === a.id ? { ...x, status: 'In Progress' } : x)); setTab('session'); }}>Start session</button>}
          </div>
        ))}
        <div className="card"><label className="font-semibold">{tier === 1 ? 'Non-clinical notes' : 'Structured session notes'}</label>
          {tier === 1 ? <textarea className="w-full rounded-xl border border-sage p-2 mt-1" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Mood, themes, habit goals…" />
            : ['Presenting concern', 'Assessment', 'Plan'].map((h) => <textarea key={h} className="w-full rounded-xl border border-sage p-2 mt-1" rows={2} placeholder={h} />)}
        </div>
      </div>}

      {tab === 'profile' && <div className="card space-y-3">
        <label className="font-semibold block">Qualification tier
          <select className="block w-full rounded-xl border border-sage p-2 mt-1" value={tier} onChange={(e) => setTier(+e.target.value)}>
            <option value={1}>Tier 1: BA/BSc Psychology</option><option value={2}>Tier 2: MA/MSc / PG Diploma</option><option value={3}>Tier 3: RCI-registered (M.Phil / Diploma)</option>
          </select></label>
        <label className="btn-s flex items-center gap-2 cursor-pointer"><Upload size={16} />{tier === 3 ? 'Upload RCI certificate' : "Upload Master's/degree proof"}<input type="file" className="sr-only" /></label>
        <div className="overflow-x-auto"><table className="text-sm"><thead><tr><th />{DAYS.map((d) => <th key={d} className="px-2">{d}</th>)}</tr></thead><tbody>
          {HRS.map((h) => <tr key={h}><td className="pr-2">{h}</td>{DAYS.map((d) => { const k = d + h; return <td key={k}><button aria-pressed={!!avail[k]} onClick={() => setAvail({ ...avail, [k]: !avail[k] })} className={`h-8 w-10 rounded-lg border border-sage ${avail[k] ? 'bg-teal' : 'bg-white'}`} /></td>; })}</tr>)}
        </tbody></table></div>
      </div>}

      {tab === 'session' && <div className="space-y-3">
        <Chat role="provider" />
        <div className="flex gap-2 flex-wrap">
          <label className="btn bg-alert text-white flex items-center gap-2 cursor-pointer"><ShieldAlert size={16} />Trigger crisis escalation
            <input type="checkbox" className="sr-only" checked={crisis} onChange={(e) => { setCrisis(e.target.checked); if (e.target.checked) sock().emit('crisis'); }} /></label>
          {tier < 3 && <button className="btn-s flex items-center gap-2" disabled={sent} onClick={() => { sock().emit('referral', { amount: 500 }); setSent(true); }}><ArrowUpRight size={16} />{sent ? 'Tier 3 transfer sent' : 'Recommend Tier 3 transfer (₹500 voucher)'}</button>}
        </div>
        {crisis && <div className="card border-alert"><b>Crisis protocol active.</b> Stay connected. The Tele-MANAS card is showing on the client's screen. Stay calm, keep the client talking, confirm their location and a trusted contact, and call 112 if there is immediate danger.</div>}
      </div>}
    </div>
  );
}
